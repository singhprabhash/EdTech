import { configuration } from "../src/server/config.mjs";
import { database, closeDatabases } from "../src/server/database.mjs";
import { deliverOutbox } from "../src/server/mail.mjs";
import { createBackup, restoreBackup } from "../src/server/backup.mjs";
import { hashPassword } from "../src/server/auth.mjs";
const [command, ...args] = process.argv.slice(2);
try {
  const config = configuration();
  if (command === "password") {
    if (process.stdin.isTTY)
      throw new Error(
        "Read the password from standard input using a private prompt or secret manager.",
      );
    let password = "";
    for await (const chunk of process.stdin) {
      password += chunk.toString();
      if (password.length > 258) throw new Error("Password too long");
    }
    process.stdout.write(hashPassword(password.replace(/\r?\n$/, "")) + "\n");
  } else if (command === "restore") {
    if (args.length !== 2)
      throw new Error(
        "Usage: restore <private snapshot directory> <new private data directory>",
      );
    console.log(JSON.stringify(await restoreBackup(args[0], args[1])));
  } else {
    if (!config.storage)
      throw new Error(
        "Configure a private AEETDS_DATA_DIR and AEETDS_APP_SECRET first.",
      );
    if (command === "init") {
      database(config.storage);
      console.log("Private storage initialized.");
    } else if (command === "retry") {
      if (!config.enabled)
        throw new Error("Submission/SMTP configuration is incomplete.");
      const result = await deliverOutbox(database(config.storage), config);
      console.log(JSON.stringify(result));
      if (result.failed) process.exitCode = 1;
    } else if (command === "backup") {
      if (!process.env.AEETDS_BACKUP_DIR)
        throw new Error("Configure a separate private AEETDS_BACKUP_DIR.");
      console.log(
        JSON.stringify(
          await createBackup(config.storage, process.env.AEETDS_BACKUP_DIR),
        ),
      );
    } else throw new Error("Use init, retry, backup, restore or password.");
  }
} catch {
  console.error(
    "Operation failed. Check configuration, private storage permissions and the operation instructions. No private data was printed.",
  );
  process.exitCode = 1;
} finally {
  closeDatabases();
}
