"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// plugin/index.ts
var index_exports = {};
__export(index_exports, {
  BaseSource: () => BaseSource,
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var import_vite = require("vite");

// plugin/lib/constant.ts
var import_node_os = __toESM(require("node:os"));
var import_node_path = __toESM(require("node:path"));
var PKG_NAME = "vite-plugin-mkcert";
var PLUGIN_NAME = PKG_NAME.replace(/-/g, ":");
var PLUGIN_DATA_DIR = import_node_path.default.join(import_node_os.default.homedir(), `.${PKG_NAME}`);

// plugin/lib/util.ts
var import_node_child_process = __toESM(require("node:child_process"));
var import_node_crypto = __toESM(require("node:crypto"));
var import_node_fs = __toESM(require("node:fs"));
var import_node_os2 = __toESM(require("node:os"));
var import_node_path2 = __toESM(require("node:path"));
var import_node_util = __toESM(require("node:util"));
var exists = async (filePath) => {
  try {
    await import_node_fs.default.promises.access(filePath);
    return true;
  } catch (_error) {
    return false;
  }
};
var mkdir = async (dirname) => {
  const isExist = await exists(dirname);
  if (!isExist) {
    await import_node_fs.default.promises.mkdir(dirname, { recursive: true });
  }
};
var ensureDirExist = async (filePath, strip = false) => {
  const dirname = strip ? import_node_path2.default.dirname(filePath) : filePath;
  await mkdir(dirname);
};
var readFile = async (filePath) => {
  const isExist = await exists(filePath);
  return isExist ? (await import_node_fs.default.promises.readFile(filePath)).toString() : void 0;
};
var writeFile = async (filePath, data) => {
  await ensureDirExist(filePath, true);
  await import_node_fs.default.promises.writeFile(filePath, data);
  await import_node_fs.default.promises.chmod(filePath, 511);
};
var readDir = async (source) => {
  return import_node_fs.default.promises.readdir(source);
};
var copyDir = async (source, dest) => {
  try {
    await import_node_fs.default.promises.cp(source, dest, {
      recursive: true
    });
  } catch (error) {
    console.log(`${PLUGIN_NAME}:`, error);
  }
};
var exec = async (cmd, options) => {
  return import_node_util.default.promisify(import_node_child_process.default.exec)(cmd, options);
};
var isIPV4 = (family) => {
  return family === "IPv4" || family === 4;
};
var getLocalV4Ips = () => {
  const interfaceDict = import_node_os2.default.networkInterfaces();
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
    const hash = import_node_crypto.default.createHash("sha256");
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
var escapeStr = (path5) => {
  return `"${path5}"`;
};

// plugin/mkcert/index.ts
var import_node_path4 = __toESM(require("node:path"));
var import_node_process = __toESM(require("node:process"));
var import_picocolors = __toESM(require("picocolors"));

// plugin/lib/logger.ts
var import_debug = __toESM(require("debug"));
var debug = (0, import_debug.default)(PLUGIN_NAME);

// plugin/mkcert/config.ts
var import_node_path3 = __toESM(require("node:path"));
var CONFIG_FILE_NAME = "config.json";
var Config = class {
  /**
   * The mkcert version
   */
  version;
  record;
  configFilePath;
  constructor({ savePath }) {
    this.configFilePath = import_node_path3.default.resolve(savePath, CONFIG_FILE_NAME);
  }
  async init() {
    const str = await readFile(this.configFilePath);
    const options = str ? JSON.parse(str) : void 0;
    if (options) {
      this.version = options.version;
      this.record = options.record;
    }
  }
  async serialize() {
    await writeFile(this.configFilePath, prettyLog(this));
  }
  // deep merge
  async merge(obj) {
    const currentStr = prettyLog(this);
    deepMerge(this, obj);
    const nextStr = prettyLog(this);
    debug(
      `Receive parameter
 ${prettyLog(
        obj
      )}
Update config from
 ${currentStr} 
to
 ${nextStr}`
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
var import_axios = __toESM(require("axios"));
var request = import_axios.default.create();
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
var Downloader = class _Downloader {
  static create() {
    return new _Downloader();
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
  // whether the files has been tampered with
  equal(hash) {
    const oldHash = this.getHash();
    if (!oldHash) {
      return false;
    }
    return oldHash.key === hash.key && oldHash.cert === hash.cert;
  }
  async update(record) {
    await this.config.merge({ record });
  }
};
var record_default = Record;

// plugin/mkcert/source.ts
var BaseSource = class {
  getPlatformIdentifier() {
    const arch = process.arch === "x64" ? "amd64" : process.arch;
    return process.platform === "win32" ? `windows-${arch}.exe` : `${process.platform}-${arch}`;
  }
};
var GithubSource = class _GithubSource extends BaseSource {
  static create() {
    return new _GithubSource();
  }
  constructor() {
    super();
  }
  async getSourceInfo() {
    const { data } = await request_default({
      method: "GET",
      url: "https://api.github.com/repos/FiloSottile/mkcert/releases/latest"
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
var CodingSource = class _CodingSource extends BaseSource {
  static CODING_API = "https://e.coding.net/open-api";
  static CODING_AUTHORIZATION = "token 000f7831ec425079439b0f55f55c729c9280d66e";
  static CODING_PROJECT_ID = 8524617;
  static REPOSITORY = "mkcert";
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
  /**
   * Get filename of Coding.net artifacts
   *
   * @see https://liuweigl.coding.net/p/github/artifacts/885241/generic/packages
   *
   * @returns name
   */
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
    const version = VersionData.Response.Data?.InstanceSet[0]?.Version;
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
var Mkcert = class _Mkcert {
  force;
  autoUpgrade;
  sourceType;
  savePath;
  logger;
  source;
  localMkcert;
  savedMkcert;
  keyFilePath;
  certFilePath;
  config;
  static create(options) {
    return new _Mkcert(options);
  }
  constructor(options) {
    const {
      force,
      autoUpgrade,
      source,
      mkcertPath,
      savePath = PLUGIN_DATA_DIR,
      keyFileName = "dev.pem",
      certFileName = "cert.pem",
      logger
    } = options;
    this.force = force;
    this.logger = logger;
    this.autoUpgrade = autoUpgrade;
    this.localMkcert = mkcertPath;
    this.savePath = import_node_path4.default.resolve(savePath);
    this.keyFilePath = import_node_path4.default.resolve(savePath, keyFileName);
    this.certFilePath = import_node_path4.default.resolve(savePath, certFileName);
    this.sourceType = source || "github";
    if (this.sourceType === "github") {
      this.source = GithubSource.create();
    } else if (this.sourceType === "coding") {
      this.source = CodingSource.create();
    } else {
      this.source = this.sourceType;
    }
    this.savedMkcert = import_node_path4.default.resolve(
      savePath,
      import_node_process.default.platform === "win32" ? "mkcert.exe" : "mkcert"
    );
    this.config = new config_default({ savePath: this.savePath });
  }
  async getMkcertBinary() {
    let binary;
    if (this.localMkcert) {
      if (await exists(this.localMkcert)) {
        binary = this.localMkcert;
      } else {
        this.logger.error(
          import_picocolors.default.red(
            `${this.localMkcert} does not exist, please check the mkcertPath parameter`
          )
        );
      }
    } else if (await exists(this.savedMkcert)) {
      binary = this.savedMkcert;
    }
    return binary;
  }
  async checkCAExists() {
    const files = await readDir(this.savePath);
    return files.some((file) => file.includes("rootCA"));
  }
  async retainExistedCA() {
    if (await this.checkCAExists()) {
      return;
    }
    const mkcertBinary = await this.getMkcertBinary();
    const commandStatement = `${escapeStr(mkcertBinary)} -CAROOT`;
    debug(`Exec ${commandStatement}`);
    const commandResult = await exec(commandStatement);
    const caDirPath = import_node_path4.default.resolve(
      commandResult.stdout.toString().replace(/\n/g, "")
    );
    if (caDirPath === this.savePath) {
      return;
    }
    const caDirExists = await exists(caDirPath);
    if (!caDirExists) {
      return;
    }
    await copyDir(caDirPath, this.savePath);
  }
  async getCertificate() {
    const key = await readFile(this.keyFilePath);
    const cert = await readFile(this.certFilePath);
    return {
      key,
      cert
    };
  }
  async createCertificate(hosts) {
    const names = hosts.join(" ");
    const mkcertBinary = await this.getMkcertBinary();
    if (!mkcertBinary) {
      debug(
        `Mkcert does not exist, unable to generate certificate for ${names}`
      );
    }
    await ensureDirExist(this.savePath);
    await this.retainExistedCA();
    const cmd = `${escapeStr(mkcertBinary)} -install -key-file ${escapeStr(
      this.keyFilePath
    )} -cert-file ${escapeStr(this.certFilePath)} ${names}`;
    await exec(cmd, {
      env: {
        ...import_node_process.default.env,
        CAROOT: this.savePath,
        JAVA_HOME: void 0
      }
    });
    this.logger.info(
      `The list of generated files:
${this.keyFilePath}
${this.certFilePath}`
    );
  }
  getLatestHash = async () => {
    return {
      key: await getHash(this.keyFilePath),
      cert: await getHash(this.certFilePath)
    };
  };
  async regenerate(record, hosts) {
    await this.createCertificate(hosts);
    const hash = await this.getLatestHash();
    record.update({ hosts, hash });
  }
  async init() {
    await ensureDirExist(this.savePath);
    await this.config.init();
    const mkcertBinary = await this.getMkcertBinary();
    if (!mkcertBinary) {
      await this.initMkcert();
    } else if (this.autoUpgrade) {
      await this.upgradeMkcert();
    }
  }
  async getSourceInfo() {
    const sourceInfo = await this.source.getSourceInfo();
    if (!sourceInfo) {
      const message = typeof this.sourceType === "string" ? `Unsupported platform. Unable to find a binary file for ${import_node_process.default.platform} platform with ${import_node_process.default.arch} arch on ${this.sourceType === "github" ? "https://github.com/FiloSottile/mkcert/releases" : "https://liuweigl.coding.net/p/github/artifacts?hash=8d4dd8949af543159c1b5ac71ff1ff72"}` : 'Please check your custom "source", it seems to return invalid result';
      throw new Error(message);
    }
    return sourceInfo;
  }
  async initMkcert() {
    const sourceInfo = await this.getSourceInfo();
    debug("The mkcert does not exist, download it now");
    await this.downloadMkcert(sourceInfo.downloadUrl, this.savedMkcert);
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
    await this.downloadMkcert(sourceInfo.downloadUrl, this.savedMkcert);
    versionManger.update(versionInfo.nextVersion);
  }
  async downloadMkcert(sourceUrl, distPath) {
    const downloader = downloader_default.create();
    await downloader.download(sourceUrl, distPath);
  }
  async renew(hosts) {
    const record = new record_default({ config: this.config });
    if (this.force) {
      debug("Certificate is forced to regenerate");
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
    if (!record.equal(hash)) {
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
  /**
   * Get certificates
   *
   * @param hosts host collection
   * @returns cretificates
   */
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
      if (typeof server.https === "boolean" && server.https === false) {
        return;
      }
      const { hosts = [], ...mkcertOptions } = options;
      const logger = (0, import_vite.createLogger)(logLevel, {
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
      const uniqueHosts = Array.from(new Set(allHosts)).filter(Boolean);
      const certificate = await mkcert.install(uniqueHosts);
      const httpsConfig = {
        key: certificate.key && Buffer.from(certificate.key),
        cert: certificate.cert && Buffer.from(certificate.cert)
      };
      return {
        server: {
          https: httpsConfig
        },
        preview: {
          https: httpsConfig
        }
      };
    }
  };
};
var index_default = plugin;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BaseSource
});
//# sourceMappingURL=mkcert.js.map
