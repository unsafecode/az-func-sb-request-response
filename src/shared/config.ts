import { envAppConfiguration } from "azure-env-app-configuration";
import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";

const credential = new DefaultAzureCredential();

async function readKeyVault() {
  const url = `https://${process.env.KEYVAULT_NAME}.vault.azure.net`;
  const client = new SecretClient(url, credential);
  for await (let secretProperties of client.listPropertiesOfSecrets()) {
    if (secretProperties.enabled) {
      const secret = await client.getSecret(secretProperties.name);
      process.env[secretProperties.name] = secret.value;
    }
  }
}

export default async function init() {
  await envAppConfiguration({
    tokenCredential: credential,
  });
  await readKeyVault();
}
