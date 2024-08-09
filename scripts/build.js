const { readFileSync, unlinkSync, mkdirSync, cpSync, rmSync } = require("fs");
const { join } = require("path");
const { execSync } = require("child_process");
const { DOMParser } = require('xmldom');
const xpath = require('xpath');

const xmlFilePath = join(__dirname, "../src/", "ModInfo.xml");
const xmlRaw = readFileSync(xmlFilePath, "utf8");
const doc = new DOMParser().parseFromString(xmlRaw, 'text/xml');
const versionNode = xpath.select1("/xml/Version/@value", doc);
const modNameNode = xpath.select1("/xml/Name/@value", doc);

const version = versionNode.value;
const modName = modNameNode.value;

const artifact = `${modName}_${version}.7z`;
const distDir = join(__dirname, "..", "dist");

try {
  rmSync(distDir, {recursive: true});
} catch (e) {
  // directory does not exist
}

try {
  unlinkSync(artifact);
} catch (e) {
}

const modDistDir = join(distDir, modName);
const srcDir = join(__dirname, "..", "src");

mkdirSync(modDistDir, { recursive: true });

cpSync(srcDir, modDistDir, { recursive: true });

execSync(`.\\node_modules\\7z-bin\\win32\\7z.exe a "${artifact}" "${modDistDir}"`);
