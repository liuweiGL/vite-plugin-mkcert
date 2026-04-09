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
let node_path = require("node:path");
node_path = __toESM(node_path);
let node_process = require("node:process");
node_process = __toESM(node_process);
let node_child_process = require("node:child_process");
node_child_process = __toESM(node_child_process);
let node_util = require("node:util");
node_util = __toESM(node_util);
let node_os = require("node:os");
node_os = __toESM(node_os);
let node_crypto = require("node:crypto");
node_crypto = __toESM(node_crypto);
let node_fs = require("node:fs");
node_fs = __toESM(node_fs);
let debug = require("debug");
debug = __toESM(debug);
let undici = require("undici");

//#region src/utils/command.ts
const exec = async (cmd, options) => {
	return node_util.default.promisify(node_child_process.default.exec)(cmd, options);
};
const findCommandFromPath = async (command) => {
	const lookupCmd = node_process.default.platform === "win32" ? `where ${command}` : `command -v ${command}`;
	try {
		const { stdout } = await exec(lookupCmd);
		const output = stdout.toString().trim();
		if (!output) return;
		return output.split(/\r?\n/)[0].trim() || void 0;
	} catch (_error) {
		return;
	}
};
const escapeStr = (path) => {
	return `"${path}"`;
};

//#endregion
//#region src/utils/constant.ts
const PKG_NAME = "vite-plugin-mkcert";
const PLUGIN_NAME = PKG_NAME.replace(/-/g, ":");
const PLUGIN_DATA_DIR = node_path.default.join(node_os.default.homedir(), `.${PKG_NAME}`);

//#endregion
//#region src/utils/logger.ts
const LOG_NAMESPACES = {
	debug: `${PLUGIN_NAME}:DEBUG`,
	info: `${PLUGIN_NAME}:INFO`,
	warn: `${PLUGIN_NAME}:WARN`,
	error: `${PLUGIN_NAME}:ERROR`
};
const NAMESPACE_COLORS = {
	[LOG_NAMESPACES.debug]: 33,
	[LOG_NAMESPACES.info]: 46,
	[LOG_NAMESPACES.warn]: 214,
	[LOG_NAMESPACES.error]: 196
};
const defaultSelectColor = debug.default.selectColor.bind(debug.default);
debug.default.selectColor = (namespace) => {
	return NAMESPACE_COLORS[namespace] ?? defaultSelectColor(namespace);
};
const LEVEL_TO_NAMESPACES = {
	info: [
		LOG_NAMESPACES.info,
		LOG_NAMESPACES.warn,
		LOG_NAMESPACES.error
	],
	warn: [LOG_NAMESPACES.warn, LOG_NAMESPACES.error],
	error: [LOG_NAMESPACES.error],
	silent: []
};
const isLogLevel = (level) => {
	return level === "info" || level === "warn" || level === "error" || level === "silent";
};
const setLogLevel = (level) => {
	if (!isLogLevel(level)) return;
	debug.default.enable(LEVEL_TO_NAMESPACES[level].join(","));
};
const debug_log = (0, debug.default)(LOG_NAMESPACES.debug);
const info_log = (0, debug.default)(LOG_NAMESPACES.info);
info_log.log = console.info.bind(console);
const warn_log = (0, debug.default)(LOG_NAMESPACES.warn);
warn_log.log = console.warn.bind(console);
const error_log = (0, debug.default)(LOG_NAMESPACES.error);
error_log.log = console.error.bind(console);
const prettyLog = (obj) => {
	return JSON.stringify(obj, null, 2);
};

//#endregion
//#region src/utils/fs.ts
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
		error_log("Failed to copy directory from %s to %s: %o", source, dest, error);
	}
};
const getHash = async (filePath) => {
	const content = await readFile(filePath);
	if (content) {
		const hash = node_crypto.default.createHash("sha256");
		hash.update(content);
		return hash.digest("hex");
	}
};

//#endregion
//#region src/utils/object.ts
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
		debug_log(`Receive parameter\n ${prettyLog(obj)}\nUpdate config from\n ${currentStr} \nto\n ${nextStr}`);
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
//#region src/utils/request.ts
const getProxyFromEnv = () => {
	return (node_process.default.env.HTTPS_PROXY || node_process.default.env.https_proxy || node_process.default.env.HTTP_PROXY || node_process.default.env.http_proxy)?.trim() || void 0;
};
const proxyAgentMap = /* @__PURE__ */ new Map();
const getDispatcher = (proxy) => {
	const proxyUrl = proxy?.trim() || getProxyFromEnv();
	if (!proxyUrl) return;
	let dispatcher = proxyAgentMap.get(proxyUrl);
	if (!dispatcher) {
		dispatcher = new undici.ProxyAgent(proxyUrl);
		proxyAgentMap.set(proxyUrl, dispatcher);
	}
	return dispatcher;
};
const readArrayBufferWithProgress = async (response, onDownloadProgress) => {
	if (!onDownloadProgress || !response.body) return Buffer.from(await response.arrayBuffer());
	const totalHeader = response.headers.get("content-length");
	const total = totalHeader ? Number(totalHeader) : void 0;
	const reader = response.body.getReader();
	const chunks = [];
	let loaded = 0;
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		if (value) {
			chunks.push(value);
			loaded += value.byteLength;
			onDownloadProgress({
				loaded,
				total,
				percent: total ? loaded / total * 100 : void 0
			});
		}
	}
	return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)), loaded);
};
const parseResponse = async (response, responseType, onDownloadProgress) => {
	if (responseType === "arraybuffer") return readArrayBufferWithProgress(response, onDownloadProgress);
	if (responseType === "text") return await response.text();
	const contentType = response.headers.get("content-type");
	if (responseType === "json" || contentType?.includes("application/json")) return await response.json();
	return await response.text();
};
async function doRequest(config) {
	const { method = "GET", url, data, headers, responseType, proxy, onDownloadProgress } = config;
	const init = { method };
	if (data) {
		init.headers = {
			"Content-Type": "application/json",
			...headers
		};
		init.body = JSON.stringify(data);
	} else if (headers) init.headers = headers;
	const dispatcher = getDispatcher(proxy);
	if (dispatcher) init.dispatcher = dispatcher;
	try {
		const response = await (0, undici.fetch)(url, init);
		if (!response.ok) throw new Error(`Request failed [${method}] ${url} (${response.status} ${response.statusText})`);
		return { data: await parseResponse(response, responseType, onDownloadProgress) };
	} catch (error) {
		error_log("Request error: %o", error);
		throw error;
	}
}
const request = Object.assign(doRequest, { get: (url, config) => doRequest({
	...config,
	method: "GET",
	url
}) });

//#endregion
//#region src/utils/throttle.ts
const throttle = (fn, wait = 300) => {
	let timeout;
	let lastInvokeTime = 0;
	let pendingArgs;
	const invoke = (args) => {
		lastInvokeTime = Date.now();
		fn(...args);
	};
	const throttled = ((...args) => {
		const remaining = wait - (Date.now() - lastInvokeTime);
		pendingArgs = args;
		if (remaining <= 0 || remaining > wait) {
			if (timeout) {
				clearTimeout(timeout);
				timeout = void 0;
			}
			invoke(args);
			pendingArgs = void 0;
			return;
		}
		if (!timeout) timeout = setTimeout(() => {
			timeout = void 0;
			if (!pendingArgs) return;
			invoke(pendingArgs);
			pendingArgs = void 0;
		}, remaining);
	});
	throttled.cancel = () => {
		if (timeout) {
			clearTimeout(timeout);
			timeout = void 0;
		}
		pendingArgs = void 0;
	};
	throttled.flush = () => {
		if (timeout) {
			clearTimeout(timeout);
			timeout = void 0;
		}
		if (!pendingArgs) return;
		invoke(pendingArgs);
		pendingArgs = void 0;
	};
	return throttled;
};

//#endregion
//#region src/mkcert/downloader.ts
var Downloader = class Downloader {
	static create() {
		return new Downloader();
	}
	constructor() {}
	async download({ downloadUrl, savedPath, proxy, logProgress = true }) {
		let lastPercent = 0;
		debug_log("Downloading the mkcert executable from %s%s", downloadUrl, proxy ? ` via proxy ${proxy}` : "");
		const { data } = await request.get(downloadUrl, {
			responseType: "arraybuffer",
			proxy,
			onDownloadProgress: throttle((progress) => {
				if (!logProgress) return;
				if (typeof progress.percent === "number") {
					const roundedPercent = Math.min(100, Math.floor(progress.percent));
					const bucket = Math.floor(roundedPercent / 10) * 10;
					if (bucket >= lastPercent || roundedPercent === 100) {
						lastPercent = bucket;
						info_log(`Downloading mkcert binary... ${roundedPercent}%`);
					}
				}
			}, 300)
		});
		await writeFile(savedPath, data);
		debug_log("The mkcert has been saved to %s", savedPath);
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
			warn_log("Failed to record mkcert version info: %o", err);
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
	source;
	localMkcert;
	proxy;
	downloadProgress;
	savedMkcert;
	keyFilePath;
	certFilePath;
	config;
	static create(options) {
		return new Mkcert(options);
	}
	constructor(options) {
		const { force, autoUpgrade, source, mkcertPath, proxy, downloadProgress = true, savePath = PLUGIN_DATA_DIR, keyFileName = "dev.pem", certFileName = "cert.pem" } = options;
		this.force = force;
		this.autoUpgrade = autoUpgrade;
		this.localMkcert = mkcertPath;
		this.proxy = proxy?.trim() || void 0;
		this.downloadProgress = downloadProgress;
		this.savePath = node_path.default.resolve(savePath);
		this.keyFilePath = node_path.default.resolve(this.savePath, keyFileName);
		this.certFilePath = node_path.default.resolve(this.savePath, certFileName);
		this.sourceType = source || "github";
		if (this.sourceType === "github") this.source = GithubSource.create();
		else if (this.sourceType === "coding") this.source = CodingSource.create();
		else this.source = this.sourceType;
		this.savedMkcert = node_path.default.resolve(this.savePath, node_process.default.platform === "win32" ? "mkcert.exe" : "mkcert");
		this.config = new Config({ savePath: this.savePath });
	}
	async getMkcertBinary() {
		if (this.localMkcert) if (await exists(this.localMkcert)) return this.localMkcert;
		else warn_log(`${this.localMkcert} does not exist, please check the mkcertPath parameter`);
		if (await exists(this.savedMkcert)) return this.savedMkcert;
		return findCommandFromPath("mkcert");
	}
	async checkCAExists() {
		return (await readDir(this.savePath)).some((file) => file.includes("rootCA"));
	}
	async retainExistedCA() {
		if (await this.checkCAExists()) return;
		const commandStatement = `${escapeStr(await this.getMkcertBinary())} -CAROOT`;
		debug_log(`Exec ${commandStatement}`);
		const commandResult = await exec(commandStatement);
		const caDirPath = node_path.default.resolve(commandResult.stdout.toString().trim());
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
		if (!mkcertBinary) {
			error_log(`Mkcert does not exist, unable to generate certificate for ${names}`);
			throw new Error("Mkcert binary is not found");
		}
		await ensureDirExist(this.savePath);
		await this.retainExistedCA();
		await exec(`${escapeStr(mkcertBinary)} -install -key-file ${escapeStr(this.keyFilePath)} -cert-file ${escapeStr(this.certFilePath)} ${names}`, { env: {
			...node_process.default.env,
			CAROOT: this.savePath,
			JAVA_HOME: void 0
		} });
		debug_log(`The list of generated files:\n${this.keyFilePath}\n${this.certFilePath}`);
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
		warn_log("The mkcert does not exist, download it now");
		await this.downloadMkcert(sourceInfo.downloadUrl, this.savedMkcert, this.proxy);
	}
	async upgradeMkcert() {
		const versionManger = new VersionManger({ config: this.config });
		const sourceInfo = await this.getSourceInfo();
		if (!sourceInfo) {
			warn_log("Can not obtain download information of mkcert, update skipped");
			return;
		}
		const versionInfo = versionManger.compare(sourceInfo.version);
		if (!versionInfo.shouldUpdate) {
			debug_log("Mkcert is kept latest version, update skipped");
			return;
		}
		if (versionInfo.breakingChange) {
			debug_log("The current version of mkcert is %s, and the latest version is %s, there may be some breaking changes, update skipped", versionInfo.currentVersion, versionInfo.nextVersion);
			return;
		}
		debug_log("The current version of mkcert is %s, and the latest version is %s, mkcert will be updated", versionInfo.currentVersion, versionInfo.nextVersion);
		await this.downloadMkcert(sourceInfo.downloadUrl, this.savedMkcert, this.proxy);
		versionManger.update(versionInfo.nextVersion);
	}
	async downloadMkcert(sourceUrl, distPath, proxy) {
		await Downloader.create().download({
			downloadUrl: sourceUrl,
			savedPath: distPath,
			proxy,
			logProgress: this.downloadProgress
		});
	}
	async renew(hosts) {
		const record = new Record({ config: this.config });
		if (this.force) {
			debug_log("Certificate is forced to regenerate");
			await this.regenerate(record, hosts);
			return;
		}
		if (!record.contains(hosts)) {
			debug_log(`The hosts changed from [${record.getHosts()}] to [${hosts}], start regenerate certificate`);
			await this.regenerate(record, hosts);
			return;
		}
		const hash = await this.getLatestHash();
		if (!record.equal(hash)) {
			debug_log(`The hash changed from ${prettyLog(record.getHash())} to ${prettyLog(hash)}, start regenerate certificate`);
			await this.regenerate(record, hosts);
			return;
		}
		debug_log("Neither hosts nor hash has changed, skip regenerate certificate");
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
//#region src/utils/network.ts
/**
* http://nodejs.cn/api/os/os_networkinterfaces.html
*/
const isIPV4 = (family) => {
	return family === "IPv4" || family === 4;
};
const isIPV6 = (family) => {
	return family === "IPv6" || family === 6;
};
const getLocalIps = (matcher) => {
	const interfaceDict = node_os.default.networkInterfaces();
	const addresses = /* @__PURE__ */ new Set();
	for (const key in interfaceDict) {
		const interfaces = interfaceDict[key];
		if (interfaces) {
			for (const item of interfaces) if (matcher(item.family)) addresses.add(item.address);
		}
	}
	return Array.from(addresses);
};
const getLocalV4Ips = () => {
	return getLocalIps(isIPV4);
};
const getLocalV6Ips = () => {
	return getLocalIps(isIPV6).map((ip) => {
		return ip.split("%")[0];
	}).filter(Boolean);
};
const getDefaultHosts = () => {
	return [
		"localhost",
		"::1",
		...getLocalV4Ips(),
		...getLocalV6Ips()
	];
};

//#endregion
//#region src/index.ts
const plugin = ({ apply = "serve", hosts = [], logLevel, ...mkcertOptions } = {}) => {
	return {
		name: PLUGIN_NAME,
		apply,
		config: async ({ server = {}, logLevel: viteLogLevel }) => {
			setLogLevel(logLevel ?? viteLogLevel ?? "info");
			if (typeof server.https === "boolean" && server.https === false) return;
			const mkcert = Mkcert.create(mkcertOptions);
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