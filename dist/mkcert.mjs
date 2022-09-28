var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// plugin/index.ts
import { createLogger } from "vite";

// plugin/lib/constant.ts
import os from "os";
import path from "path";
var PKG_NAME = "vite-plugin-mkcert";
var PLUGIN_NAME = PKG_NAME.replace(/-/g, ":");
var PLUGIN_DATA_DIR = path.join(os.homedir(), `.${PKG_NAME}`);

// plugin/lib/util.ts
import child_process from "child_process";
import crypto from "crypto";
import fs from "fs";
import os2 from "os";
import path2 from "path";
import util from "util";
var exists = async (filePath) => {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
};
var resolvePath = (fileName) => {
  return path2.resolve(PLUGIN_DATA_DIR, fileName);
};
var mkdir = async (dirname) => {
  const isExist = await exists(dirname);
  if (!isExist) {
    await fs.promises.mkdir(dirname, { recursive: true });
  }
};
var ensureDirExist = async (filePath) => {
  const dirname = path2.dirname(filePath);
  await mkdir(dirname);
};
var readFile = async (filePath) => {
  const isExist = await exists(filePath);
  return isExist ? (await fs.promises.readFile(filePath)).toString() : void 0;
};
var writeFile = async (filePath, data) => {
  await ensureDirExist(filePath);
  await fs.promises.writeFile(filePath, data);
  await fs.promises.chmod(filePath, 511);
};
var exec = async (cmd, options) => {
  return await util.promisify(child_process.exec)(cmd, options);
};
var isIPV4 = (family) => {
  return family === "IPv4" || family === 4;
};
var getLocalV4Ips = () => {
  const interfaceDict = os2.networkInterfaces();
  const addresses = [];
  for (const key in interfaceDict) {
    const interfaces = interfaceDict[key];
    if (interfaces) {
      for (const item of interfaces) {
        if (isIPV4(item.family)) {
          addresses.push(item.address);
        }
      }
    }
  }
  return addresses;
};
var getDefaultHosts = () => {
  return ["localhost", ...getLocalV4Ips()];
};
var getHash = async (filePath) => {
  const content = await readFile(filePath);
  if (content) {
    const hash = crypto.createHash("sha256");
    hash.update(content);
    return hash.digest("hex");
  }
  return void 0;
};
var isObj = (obj) => Object.prototype.toString.call(obj) === "[object Object]";
var mergeObj = (target, source) => {
  if (!(isObj(target) && isObj(source))) {
    return target;
  }
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const targetValue = target[key];
      const sourceValue = source[key];
      if (isObj(targetValue) && isObj(sourceValue)) {
        mergeObj(targetValue, sourceValue);
      } else {
        target[key] = sourceValue;
      }
    }
  }
};
var deepMerge = (target, ...source) => {
  return source.reduce((a, b) => mergeObj(a, b), target);
};
var prettyLog = (obj) => {
  return JSON.stringify(obj, null, 2);
};
var escape = (path3) => {
  return `"${path3}"`;
};

// plugin/mkcert/index.ts
import fs2 from "fs";
import process2 from "process";
import pc from "picocolors";

// plugin/lib/logger.ts
import Debug from "debug";
var debug = Debug(PLUGIN_NAME);

// plugin/mkcert/config.ts
var CONFIG_FILE_NAME = "config.json";
var CONFIG_FILE_PATH = resolvePath(CONFIG_FILE_NAME);
var Config = class {
  version;
  record;
  async init() {
    const str = await readFile(CONFIG_FILE_PATH);
    const options = str ? JSON.parse(str) : void 0;
    if (options) {
      this.version = options.version;
      this.record = options.record;
    }
  }
  async serialize() {
    await writeFile(CONFIG_FILE_PATH, prettyLog(this));
  }
  async merge(obj) {
    const currentStr = prettyLog(this);
    deepMerge(this, obj);
    const nextStr = prettyLog(this);
    debug(
      `Receive parameter ${prettyLog(
        obj
      )}, then update config from ${currentStr} to ${nextStr}`
    );
    await this.serialize();
  }
  getRecord() {
    return this.record;
  }
  getVersion() {
    return this.version;
  }
};
var config_default = Config;

// plugin/lib/request.ts
import axios from "axios";
var request = axios.create();
request.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    debug("Request error: %o", error);
    return Promise.reject(error);
  }
);
var request_default = request;

// plugin/mkcert/downloader.ts
var Downloader = class {
  static create() {
    return new Downloader();
  }
  constructor() {
  }
  async download(downloadUrl, savedPath) {
    debug("Downloading the mkcert executable from %s", downloadUrl);
    const { data } = await request_default.get(downloadUrl, {
      responseType: "arraybuffer"
    });
    await writeFile(savedPath, data);
    debug("The mkcert has been saved to %s", savedPath);
  }
};
var downloader_default = Downloader;

// plugin/mkcert/record.ts
var Record = class {
  config;
  constructor(options) {
    this.config = options.config;
  }
  getHosts() {
    return this.config.getRecord()?.hosts;
  }
  getHash() {
    return this.config.getRecord()?.hash;
  }
  contains(hosts) {
    const oldHosts = this.getHosts();
    if (!oldHosts) {
      return false;
    }
    for (const host of hosts) {
      if (!oldHosts.includes(host)) {
        return false;
      }
    }
    return true;
  }
  tamper(hash) {
    const oldHash = this.getHash();
    if (!oldHash) {
      return false;
    }
    if (oldHash.key === hash.key && oldHash.cert === hash.cert) {
      return false;
    }
    return true;
  }
  async update(record) {
    await this.config.merge({ record });
  }
};
var record_default = Record;

// plugin/mkcert/source.ts
import { Octokit } from "@octokit/rest";
var BaseSource = class {
  getPlatformIdentifier() {
    switch (process.platform) {
      case "win32":
        return "windows-amd64.exe";
      case "linux":
        return process.arch === "arm64" ? "linux-arm64" : process.arch === "arm" ? "linux-arm" : "linux-amd64";
      case "darwin":
        return "darwin-amd64";
      default:
        throw new Error("Unsupported platform");
    }
  }
};
var GithubSource = class extends BaseSource {
  static create() {
    return new GithubSource();
  }
  constructor() {
    super();
  }
  async getSourceInfo() {
    const octokit = new Octokit();
    const { data } = await octokit.repos.getLatestRelease({
      owner: "FiloSottile",
      repo: "mkcert"
    });
    const platformIdentifier = this.getPlatformIdentifier();
    const version = data.tag_name;
    const downloadUrl = data.assets.find(
      (item) => item.name.includes(platformIdentifier)
    )?.browser_download_url;
    if (!(version && downloadUrl)) {
      return void 0;
    }
    return {
      downloadUrl,
      version
    };
  }
};
var _CodingSource = class extends BaseSource {
  static create() {
    return new _CodingSource();
  }
  constructor() {
    super();
  }
  async request(data) {
    return request_default({
      data,
      method: "POST",
      url: _CodingSource.CODING_API,
      headers: {
        Authorization: _CodingSource.CODING_AUTHORIZATION
      }
    });
  }
  getPackageName() {
    return `mkcert-${this.getPlatformIdentifier()}`;
  }
  async getSourceInfo() {
    const { data: VersionData } = await this.request({
      Action: "DescribeArtifactVersionList",
      ProjectId: _CodingSource.CODING_PROJECT_ID,
      Repository: _CodingSource.REPOSITORY,
      Package: this.getPackageName(),
      PageSize: 1
    });
    const version = VersionData.Response.Data.InstanceSet[0]?.Version;
    if (!version) {
      return void 0;
    }
    const { data: FileData } = await this.request({
      Action: "DescribeArtifactFileDownloadUrl",
      ProjectId: _CodingSource.CODING_PROJECT_ID,
      Repository: _CodingSource.REPOSITORY,
      Package: this.getPackageName(),
      PackageVersion: version
    });
    const downloadUrl = FileData.Response.Url;
    if (!downloadUrl) {
      return void 0;
    }
    return {
      downloadUrl,
      version
    };
  }
};
var CodingSource = _CodingSource;
__publicField(CodingSource, "CODING_API", "https://e.coding.net/open-api");
__publicField(CodingSource, "CODING_AUTHORIZATION", "token 000f7831ec425079439b0f55f55c729c9280d66e");
__publicField(CodingSource, "CODING_PROJECT_ID", 8524617);
__publicField(CodingSource, "REPOSITORY", "mkcert");

// plugin/mkcert/version.ts
var parseVersion = (version) => {
  const str = version.trim().replace(/v/i, "");
  return str.split(".");
};
var VersionManger = class {
  config;
  constructor(props) {
    this.config = props.config;
  }
  async update(version) {
    try {
      await this.config.merge({ version });
    } catch (err) {
      debug("Failed to record mkcert version info: %o", err);
    }
  }
  compare(version) {
    const currentVersion = this.config.getVersion();
    if (!currentVersion) {
      return {
        currentVersion,
        nextVersion: version,
        breakingChange: false,
        shouldUpdate: true
      };
    }
    let breakingChange = false;
    let shouldUpdate = false;
    const newVersion = parseVersion(version);
    const oldVersion = parseVersion(currentVersion);
    for (let i = 0; i < newVersion.length; i++) {
      if (newVersion[i] > oldVersion[i]) {
        shouldUpdate = true;
        breakingChange = i === 0;
        break;
      }
    }
    return {
      breakingChange,
      shouldUpdate,
      currentVersion,
      nextVersion: version
    };
  }
};
var version_default = VersionManger;

// plugin/mkcert/index.ts
var KEY_FILE_PATH = resolvePath("certs/dev.key");
var CERT_FILE_PATH = resolvePath("certs/dev.pem");
var Mkcert = class {
  force;
  autoUpgrade;
  mkcertLocalPath;
  source;
  logger;
  mkcertSavedPath;
  sourceType;
  config;
  static create(options) {
    return new Mkcert(options);
  }
  constructor(options) {
    const { force, autoUpgrade, source, mkcertPath, logger } = options;
    this.force = force;
    this.logger = logger;
    this.autoUpgrade = autoUpgrade;
    this.mkcertLocalPath = mkcertPath;
    this.sourceType = source || "github";
    if (this.sourceType === "github") {
      this.source = GithubSource.create();
    } else if (this.sourceType === "coding") {
      this.source = CodingSource.create();
    } else {
      this.source = this.sourceType;
    }
    this.mkcertSavedPath = resolvePath(
      process2.platform === "win32" ? "mkcert.exe" : "mkcert"
    );
    this.config = new config_default();
  }
  async getMkcertBinnary() {
    return await this.checkMkcert() ? this.mkcertLocalPath || this.mkcertSavedPath : void 0;
  }
  async checkMkcert() {
    let exist;
    if (this.mkcertLocalPath) {
      exist = await exists(this.mkcertLocalPath);
      if (!exists) {
        this.logger.error(
          pc.red(
            `${this.mkcertLocalPath} does not exist, please check the mkcertPath paramter`
          )
        );
      }
    } else {
      exist = await exists(this.mkcertSavedPath);
    }
    return exist;
  }
  async getCertificate() {
    const key = await fs2.promises.readFile(KEY_FILE_PATH);
    const cert = await fs2.promises.readFile(CERT_FILE_PATH);
    return {
      key,
      cert
    };
  }
  async createCertificate(hosts) {
    const names = hosts.join(" ");
    const mkcertBinnary = await this.getMkcertBinnary();
    if (!mkcertBinnary) {
      debug(
        `Mkcert does not exist, unable to generate certificate for ${names}`
      );
    }
    await ensureDirExist(KEY_FILE_PATH);
    await ensureDirExist(CERT_FILE_PATH);
    const cmd = `${escape(mkcertBinnary)} -install -key-file ${escape(
      KEY_FILE_PATH
    )} -cert-file ${escape(CERT_FILE_PATH)} ${names}`;
    await exec(cmd, {
      env: {
        ...process2.env,
        JAVA_HOME: void 0
      }
    });
    this.logger.info(
      `The certificate is saved in:
${KEY_FILE_PATH}
${CERT_FILE_PATH}`
    );
  }
  getLatestHash = async () => {
    return {
      key: await getHash(KEY_FILE_PATH),
      cert: await getHash(CERT_FILE_PATH)
    };
  };
  async regenerate(record, hosts) {
    await this.createCertificate(hosts);
    const hash = await this.getLatestHash();
    record.update({ hosts, hash });
  }
  async init() {
    await this.config.init();
    const exist = await this.checkMkcert();
    if (!exist) {
      await this.initMkcert();
    } else if (this.autoUpgrade) {
      await this.upgradeMkcert();
    }
  }
  async getSourceInfo() {
    const sourceInfo = await this.source.getSourceInfo();
    if (!sourceInfo) {
      if (typeof this.sourceType === "string") {
        this.logger.error(
          "Failed to request mkcert information, please check your network"
        );
        if (this.sourceType === "github") {
          this.logger.info(
            'If you are a user in china, maybe you should set "source" paramter to "coding"'
          );
        }
      } else {
        this.logger.info(
          'Please check your custom "source", it seems to return invalid result'
        );
      }
      return void 0;
    }
    return sourceInfo;
  }
  async initMkcert() {
    const sourceInfo = await this.getSourceInfo();
    debug("The mkcert does not exist, download it now");
    if (!sourceInfo) {
      this.logger.error(
        "Can not obtain download information of mkcert, init skipped"
      );
      return;
    }
    await this.downloadMkcert(sourceInfo.downloadUrl, this.mkcertSavedPath);
  }
  async upgradeMkcert() {
    const versionManger = new version_default({ config: this.config });
    const sourceInfo = await this.getSourceInfo();
    if (!sourceInfo) {
      this.logger.error(
        "Can not obtain download information of mkcert, update skipped"
      );
      return;
    }
    const versionInfo = versionManger.compare(sourceInfo.version);
    if (!versionInfo.shouldUpdate) {
      debug("Mkcert is kept latest version, update skipped");
      return;
    }
    if (versionInfo.breakingChange) {
      debug(
        "The current version of mkcert is %s, and the latest version is %s, there may be some breaking changes, update skipped",
        versionInfo.currentVersion,
        versionInfo.nextVersion
      );
      return;
    }
    debug(
      "The current version of mkcert is %s, and the latest version is %s, mkcert will be updated",
      versionInfo.currentVersion,
      versionInfo.nextVersion
    );
    await this.downloadMkcert(sourceInfo.downloadUrl, this.mkcertSavedPath);
    versionManger.update(versionInfo.nextVersion);
  }
  async downloadMkcert(sourceUrl, distPath) {
    const downloader = downloader_default.create();
    await downloader.download(sourceUrl, distPath);
  }
  async renew(hosts) {
    const record = new record_default({ config: this.config });
    if (this.force) {
      debug(`Certificate is forced to regenerate`);
      await this.regenerate(record, hosts);
    }
    if (!record.contains(hosts)) {
      debug(
        `The hosts changed from [${record.getHosts()}] to [${hosts}], start regenerate certificate`
      );
      await this.regenerate(record, hosts);
      return;
    }
    const hash = await this.getLatestHash();
    if (record.tamper(hash)) {
      debug(
        `The hash changed from ${prettyLog(record.getHash())} to ${prettyLog(
          hash
        )}, start regenerate certificate`
      );
      await this.regenerate(record, hosts);
      return;
    }
    debug("Neither hosts nor hash has changed, skip regenerate certificate");
  }
  async install(hosts) {
    if (hosts.length) {
      await this.renew(hosts);
    }
    return await this.getCertificate();
  }
};
var mkcert_default = Mkcert;

// plugin/index.ts
var plugin = (options = {}) => {
  return {
    name: PLUGIN_NAME,
    apply: "serve",
    config: async ({ server = {}, logLevel }) => {
      if (server.https === false) {
        return;
      }
      const { hosts = [], ...mkcertOptions } = options;
      const logger = createLogger(logLevel, {
        prefix: PLUGIN_NAME
      });
      const mkcert = mkcert_default.create({
        logger,
        ...mkcertOptions
      });
      await mkcert.init();
      const allHosts = [...getDefaultHosts(), ...hosts];
      if (typeof server.host === "string") {
        allHosts.push(server.host);
      }
      const uniqueHosts = Array.from(new Set(allHosts)).filter((item) => !!item);
      const certificate = await mkcert.install(uniqueHosts);
      return {
        server: {
          https: {
            ...certificate
          }
        },
        preview: {
          https: {
            ...certificate
          }
        }
      };
    }
  };
};
var plugin_default = plugin;
export {
  BaseSource,
  plugin_default as default
};
//# sourceMappingURL=mkcert.mjs.map
