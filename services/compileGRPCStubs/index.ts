import axios from "axios";
const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");

const STUBS = "grpc_stubs";

const fetchProtoLink = async (
  orgId: string,
  serviceId: string
): Promise<string> => {
  // TODO: API integration for fetching proto file

  const downloadLink =
    "https://ropsten-service-components.s3.amazonaws.com/assets/rajeev_june_25_org/calculator_june_25/stubs/nodejs.zip";

  return downloadLink;
};

const setServiceStoragePath = async (
  orgId: string,
  serviceId: string
): Promise<string> => {
  const directory = path.resolve(__dirname, "../../", "tmp", orgId, serviceId);

  if (!fs.existsSync(directory)) {
    await fs.promises.mkdir(directory, { recursive: true });
  }

  return directory;
};

const downloadProtoZipFile = async (
  url: string,
  filePath: string
): Promise<string> => {
  try {
    const destination = `${filePath}/${STUBS}.zip`;

    const response = await axios.get(url, { responseType: "arraybuffer" });
    await fs.promises.writeFile(destination, response.data);
    return destination;
  } catch (error) {
    throw error;
  }
};

const unzipProtoFile = async (file: string, unzipFilePath: string) => {
  const zip = new AdmZip(file);
  zip.extractAllTo(`${unzipFilePath}/${STUBS}`, true);
  await fs.promises.unlink(file);
};

export const download = async (orgId: string, serviceId: string) => {
  try {
    const protoUrl = await fetchProtoLink(orgId, serviceId);
    const servicePath = await setServiceStoragePath(orgId, serviceId);
    const zippedProtofile = await downloadProtoZipFile(protoUrl, servicePath);
    await unzipProtoFile(zippedProtofile, servicePath);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
