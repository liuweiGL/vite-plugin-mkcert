Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: 'Module' } });
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") {
		for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
			key = keys[i];
			if (!__hasOwnProp.call(to, key) && key !== except) {
				__defProp(to, key, {
					get: ((k) => from[k]).bind(null, key),
					enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
				});
			}
		}
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));

//#endregion
let vite = require("vite");
let node_os = require("node:os");
node_os = __toESM(node_os);
let node_path = require("node:path");
node_path = __toESM(node_path);
let node_child_process = require("node:child_process");
node_child_process = __toESM(node_child_process);
let node_crypto = require("node:crypto");
node_crypto = __toESM(node_crypto);
let node_fs = require("node:fs");
node_fs = __toESM(node_fs);
let node_util = require("node:util");
node_util = __toESM(node_util);
let node_process = require("node:process");
node_process = __toESM(node_process);
let picocolors = require("picocolors");
picocolors = __toESM(picocolors);
let debug = require("debug");
debug = __toESM(debug);

//#region src/lib/constant.ts
const PKG_NAME = "vite-plugin-mkcert";
const PLUGIN_NAME = PKG_NAME.replace(/-/g, ":");
const PLUGIN_DATA_DIR = node_path.default.join(node_os.default.homedir(), `.${PKG_NAME}`);

//#endregion
//#region src/lib/util.ts
/**
* Check if file exists
*
* @param filePath file path
* @returns does the file exist
*/
const exists = async (filePath) => {
	try {
		await node_fs.default.promises.access(filePath);
		return true;
	} catch (_error) {
		return false;
	}
};
const mkdir = async (dirname) => {
	if (!await exists(dirname)) await node_fs.default.promises.mkdir(dirname, { recursive: true });
};
const ensureDirExist = async (filePath, strip = false) => {
	await mkdir(strip ? node_path.default.dirname(filePath) : filePath);
};
const readFile = async (filePath) => {
	return await exists(filePath) ? (await node_fs.default.promises.readFile(filePath)).toString() : void 0;
};
const writeFile = async (filePath, data) => {
	await ensureDirExist(filePath, true);
	await node_fs.default.promises.writeFile(filePath, data);
	await node_fs.default.promises.chmod(filePath, 511);
};
const readDir = async (source) => {
	return node_fs.default.promises.readdir(source);
};
const copyDir = async (source, dest) => {
	try {
		await node_fs.default.promises.cp(source, dest, { recursive: true });
	} catch (error) {
		console.log(`${PLUGIN_NAME}:`, error);
	}
};
const exec = async (cmd, options) => {
	return node_util.default.promisify(node_child_process.default.exec)(cmd, options);
};
/**
* http://nodejs.cn/api/os/os_networkinterfaces.html
*/
const isIPV4 = (family) => {
	return family === "IPv4" || family === 4;
};
const getLocalV4Ips = () => {
	const interfaceDict = node_os.default.networkInterfaces();
	const addresses = [];
	for (const key in interfaceDict) {
		const interfaces = interfaceDict[key];
		if (interfaces) {
			for (const item of interfaces) if (isIPV4(item.family)) addresses.push(item.address);
		}
	}
	return addresses;
};
const getDefaultHosts = () => {
	return ["localhost", ...getLocalV4Ips()];
};
const getHash = async (filePath) => {
	const content = await readFile(filePath);
	if (content) {
		const hash = node_crypto.default.createHash("sha256");
		hash.update(content);
		return hash.digest("hex");
	}
};
const isObj = (obj) => Object.prototype.toString.call(obj) === "[object Object]";
const mergeObj = (target, source) => {
	if (!(isObj(target) && isObj(source))) return target;
	for (const key in source) if (Object.hasOwn(source, key)) {
		const targetValue = target[key];
		const sourceValue = source[key];
		if (isObj(targetValue) && isObj(sourceValue)) mergeObj(targetValue, sourceValue);
		else target[key] = sourceValue;
	}
};
const deepMerge = (target, ...source) => {
	return source.reduce((a, b) => mergeObj(a, b), target);
};
const prettyLog = (obj) => {
	return JSON.stringify(obj, null, 2);
};
const escapeStr = (path) => {
	return `"${path}"`;
};

//#endregion
//#region src/lib/logger.ts
const debug$1 = (0, debug.default)(PLUGIN_NAME);

//#endregion
//#region src/mkcert/config.ts
const CONFIG_FILE_NAME = "config.json";
var Config = class {
	/**
	* The mkcert version
	*/
	version;
	record;
	configFilePath;
	constructor({ savePath }) {
		this.configFilePath = node_path.default.resolve(savePath, CONFIG_FILE_NAME);
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
	async merge(obj) {
		const currentStr = prettyLog(this);
		deepMerge(this, obj);
		const nextStr = prettyLog(this);
		debug$1(`Receive parameter\n ${prettyLog(obj)}\nUpdate config from\n ${currentStr} \nto\n ${nextStr}`);
		await this.serialize();
	}
	getRecord() {
		return this.record;
	}
	getVersion() {
		return this.version;
	}
};

//#endregion
//#region src/lib/request.ts
async function doRequest(config) {
	const { method = "GET", url, data, headers, responseType } = config;
	const init = { method };
	if (data) {
		init.headers = {
			"Content-Type": "application/json",
			...headers
		};
		init.body = JSON.stringify(data);
	} else if (headers) init.headers = headers;
	try {
		const response = await fetch(url, init);
		if (!response.ok) throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
		return { data: responseType === "arraybuffer" ? Buffer.from(await response.arrayBuffer()) : await response.json() };
	} catch (error) {
		debug$1("Request error: %o", error);
		throw error;
	}
}
const request = Object.assign(doRequest, { get: (url, config) => doRequest({
	...config,
	method: "GET",
	url
}) });

//#endregion
//#region src/mkcert/downloader.ts
var Downloader = class Downloader {
	static create() {
		return new Downloader();
	}
	constructor() {}
	async download(downloadUrl, savedPath) {
		debug$1("Downloading the mkcert executable from %s", downloadUrl);
		const { data } = await request.get(downloadUrl, { responseType: "arraybuffer" });
		await writeFile(savedPath, data);
		debug$1("The mkcert has been saved to %s", savedPath);
	}
};

//#endregion
//#region src/mkcert/record.ts
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
		if (!oldHosts) return false;
		for (const host of hosts) if (!oldHosts.includes(host)) return false;
		return true;
	}
	equal(hash) {
		const oldHash = this.getHash();
		if (!oldHash) return false;
		return oldHash.key === hash.key && oldHash.cert === hash.cert;
	}
	async update(record) {
		await this.config.merge({ record });
	}
};

//#endregion
//#region src/mkcert/source.ts
var BaseSource = class {
	getPlatformIdentifier() {
		const arch = process.arch === "x64" ? "amd64" : process.arch;
		return process.platform === "win32" ? `windows-${arch}.exe` : `${process.platform}-${arch}`;
	}
};
/**
* Download mkcert from github.com
*/
var GithubSource = class GithubSource extends BaseSource {
	static create() {
		return new GithubSource();
	}
	constructor() {
		super();
	}
	async getSourceInfo() {
		const { data } = await request({
			method: "GET",
			url: "https://api.github.com/repos/FiloSottile/mkcert/releases/latest"
		});
		const platformIdentifier = this.getPlatformIdentifier();
		const version = data.tag_name;
		const downloadUrl = data.assets.find((item) => item.name.includes(platformIdentifier))?.browser_download_url;
		if (!(version && downloadUrl)) return;
		return {
			downloadUrl,
			version
		};
	}
};
/**
* Download mkcert from coding.net
*
* @see https://help.coding.net/openapi
*/
var CodingSource = class CodingSource extends BaseSource {
	static CODING_API = "https://e.coding.net/open-api";
	static CODING_AUTHORIZATION = "token 000f7831ec425079439b0f55f55c729c9280d66e";
	static CODING_PROJECT_ID = 8524617;
	static REPOSITORY = "mkcert";
	static create() {
		return new CodingSource();
	}
	constructor() {
		super();
	}
	async request(data) {
		return request({
			data,
			method: "POST",
			url: CodingSource.CODING_API,
			headers: { Authorization: CodingSource.CODING_AUTHORIZATION }
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
		/**
		* @see https://help.coding.net/openapi#e2106ec64e75af66f188463b1bb7e165
		*/
		const { data: VersionData } = await this.request({
			Action: "DescribeArtifactVersionList",
			ProjectId: CodingSource.CODING_PROJECT_ID,
			Repository: CodingSource.REPOSITORY,
			Package: this.getPackageName(),
			PageSize: 1
		});
		const version = VersionData.Response.Data?.InstanceSet[0]?.Version;
		if (!version) return;
		/**
		* @see https://help.coding.net/openapi#63ad6bc7469373cef575e92bb92be71e
		*/
		const { data: FileData } = await this.request({
			Action: "DescribeArtifactFileDownloadUrl",
			ProjectId: CodingSource.CODING_PROJECT_ID,
			Repository: CodingSource.REPOSITORY,
			Package: this.getPackageName(),
			PackageVersion: version
		});
		const downloadUrl = FileData.Response.Url;
		if (!downloadUrl) return;
		return {
			downloadUrl,
			version
		};
	}
};

//#endregion
//#region src/mkcert/version.ts
const parseVersion = (version) => {
	return version.trim().replace(/v/i, "").split(".");
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
			debug$1("Failed to record mkcert version info: %o", err);
		}
	}
	compare(version) {
		const currentVersion = this.config.getVersion();
		if (!currentVersion) return {
			currentVersion,
			nextVersion: version,
			breakingChange: false,
			shouldUpdate: true
		};
		let breakingChange = false;
		let shouldUpdate = false;
		const newVersion = parseVersion(version);
		const oldVersion = parseVersion(currentVersion);
		for (let i = 0; i < newVersion.length; i++) if (newVersion[i] > oldVersion[i]) {
			shouldUpdate = true;
			breakingChange = i === 0;
			break;
		}
		return {
			breakingChange,
			shouldUpdate,
			currentVersion,
			nextVersion: version
		};
	}
};

//#endregion
//#region src/mkcert/index.ts
var Mkcert = class Mkcert {
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
		return new Mkcert(options);
	}
	constructor(options) {
		const { force, autoUpgrade, source, mkcertPath, savePath = PLUGIN_DATA_DIR, keyFileName = "dev.pem", certFileName = "cert.pem", logger } = options;
		this.force = force;
		this.logger = logger;
		this.autoUpgrade = autoUpgrade;
		this.localMkcert = mkcertPath;
		this.savePath = node_path.default.resolve(savePath);
		this.keyFilePath = node_path.default.resolve(savePath, keyFileName);
		this.certFilePath = node_path.default.resolve(savePath, certFileName);
		this.sourceType = source || "github";
		if (this.sourceType === "github") this.source = GithubSource.create();
		else if (this.sourceType === "coding") this.source = CodingSource.create();
		else this.source = this.sourceType;
		this.savedMkcert = node_path.default.resolve(savePath, node_process.default.platform === "win32" ? "mkcert.exe" : "mkcert");
		this.config = new Config({ savePath: this.savePath });
	}
	async getMkcertBinary() {
		let binary;
		if (this.localMkcert) if (await exists(this.localMkcert)) binary = this.localMkcert;
		else this.logger.error(picocolors.default.red(`${this.localMkcert} does not exist, please check the mkcertPath parameter`));
		else if (await exists(this.savedMkcert)) binary = this.savedMkcert;
		return binary;
	}
	async checkCAExists() {
		return (await readDir(this.savePath)).some((file) => file.includes("rootCA"));
	}
	async retainExistedCA() {
		if (await this.checkCAExists()) return;
		const commandStatement = `${escapeStr(await this.getMkcertBinary())} -CAROOT`;
		debug$1(`Exec ${commandStatement}`);
		const commandResult = await exec(commandStatement);
		const caDirPath = node_path.default.resolve(commandResult.stdout.toString().replace(/\n/g, ""));
		if (caDirPath === this.savePath) return;
		if (!await exists(caDirPath)) return;
		await copyDir(caDirPath, this.savePath);
	}
	async getCertificate() {
		return {
			key: await readFile(this.keyFilePath),
			cert: await readFile(this.certFilePath)
		};
	}
	async createCertificate(hosts) {
		const names = hosts.join(" ");
		const mkcertBinary = await this.getMkcertBinary();
		if (!mkcertBinary) debug$1(`Mkcert does not exist, unable to generate certificate for ${names}`);
		await ensureDirExist(this.savePath);
		await this.retainExistedCA();
		await exec(`${escapeStr(mkcertBinary)} -install -key-file ${escapeStr(this.keyFilePath)} -cert-file ${escapeStr(this.certFilePath)} ${names}`, { env: {
			...node_process.default.env,
			CAROOT: this.savePath,
			JAVA_HOME: void 0
		} });
		this.logger.info(`The list of generated files:\n${this.keyFilePath}\n${this.certFilePath}`);
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
		record.update({
			hosts,
			hash
		});
	}
	async init() {
		await ensureDirExist(this.savePath);
		await this.config.init();
		if (!await this.getMkcertBinary()) await this.initMkcert();
		else if (this.autoUpgrade) await this.upgradeMkcert();
	}
	async getSourceInfo() {
		const sourceInfo = await this.source.getSourceInfo();
		if (!sourceInfo) {
			const message = typeof this.sourceType === "string" ? `Unsupported platform. Unable to find a binary file for ${node_process.default.platform} platform with ${node_process.default.arch} arch on ${this.sourceType === "github" ? "https://github.com/FiloSottile/mkcert/releases" : "https://liuweigl.coding.net/p/github/artifacts?hash=8d4dd8949af543159c1b5ac71ff1ff72"}` : "Please check your custom \"source\", it seems to return invalid result";
			throw new Error(message);
		}
		return sourceInfo;
	}
	async initMkcert() {
		const sourceInfo = await this.getSourceInfo();
		debug$1("The mkcert does not exist, download it now");
		await this.downloadMkcert(sourceInfo.downloadUrl, this.savedMkcert);
	}
	async upgradeMkcert() {
		const versionManger = new VersionManger({ config: this.config });
		const sourceInfo = await this.getSourceInfo();
		if (!sourceInfo) {
			this.logger.error("Can not obtain download information of mkcert, update skipped");
			return;
		}
		const versionInfo = versionManger.compare(sourceInfo.version);
		if (!versionInfo.shouldUpdate) {
			debug$1("Mkcert is kept latest version, update skipped");
			return;
		}
		if (versionInfo.breakingChange) {
			debug$1("The current version of mkcert is %s, and the latest version is %s, there may be some breaking changes, update skipped", versionInfo.currentVersion, versionInfo.nextVersion);
			return;
		}
		debug$1("The current version of mkcert is %s, and the latest version is %s, mkcert will be updated", versionInfo.currentVersion, versionInfo.nextVersion);
		await this.downloadMkcert(sourceInfo.downloadUrl, this.savedMkcert);
		versionManger.update(versionInfo.nextVersion);
	}
	async downloadMkcert(sourceUrl, distPath) {
		await Downloader.create().download(sourceUrl, distPath);
	}
	async renew(hosts) {
		const record = new Record({ config: this.config });
		if (this.force) {
			debug$1("Certificate is forced to regenerate");
			await this.regenerate(record, hosts);
		}
		if (!record.contains(hosts)) {
			debug$1(`The hosts changed from [${record.getHosts()}] to [${hosts}], start regenerate certificate`);
			await this.regenerate(record, hosts);
			return;
		}
		const hash = await this.getLatestHash();
		if (!record.equal(hash)) {
			debug$1(`The hash changed from ${prettyLog(record.getHash())} to ${prettyLog(hash)}, start regenerate certificate`);
			await this.regenerate(record, hosts);
			return;
		}
		debug$1("Neither hosts nor hash has changed, skip regenerate certificate");
	}
	/**
	* Get certificates
	*
	* @param hosts host collection
	* @returns cretificates
	*/
	async install(hosts) {
		if (hosts.length) await this.renew(hosts);
		return await this.getCertificate();
	}
};

//#endregion
//#region src/index.ts
const plugin = (options = {}) => {
	return {
		name: PLUGIN_NAME,
		apply: "serve",
		config: async ({ server = {}, logLevel }) => {
			if (typeof server.https === "boolean" && server.https === false) return;
			const { hosts = [], ...mkcertOptions } = options;
			const logger = (0, vite.createLogger)(logLevel, { prefix: PLUGIN_NAME });
			const mkcert = Mkcert.create({
				logger,
				...mkcertOptions
			});
			await mkcert.init();
			const allHosts = [...getDefaultHosts(), ...hosts];
			if (typeof server.host === "string") allHosts.push(server.host);
			const uniqueHosts = Array.from(new Set(allHosts)).filter(Boolean);
			const certificate = await mkcert.install(uniqueHosts);
			const httpsConfig = {
				key: certificate.key && Buffer.from(certificate.key),
				cert: certificate.cert && Buffer.from(certificate.cert)
			};
			return {
				server: { https: httpsConfig },
				preview: { https: httpsConfig }
			};
		}
	};
};

//#endregion
exports.BaseSource = BaseSource;
exports.default = plugin;