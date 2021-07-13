require("dotenv").config();
const crypto = require("crypto");
const polka = require("polka");
const { json } = require("body-parser");
const { spawn } = require("child_process");

function createComparisonSignature(body = "") {
  const hmac = crypto.createHmac("sha1", process.env.WEBHOOK_SECRET);
  const signature = hmac.update(JSON.stringify(body)).digest("hex");
  return `sha1=${signature}`;
}

function compareSignatures(selfSignature, receivedSignature = "") {
  const source = Buffer.from(receivedSignature);
  const comparison = Buffer.from(selfSignature);
  return (
    receivedSignature.length === selfSignature.length &&
    crypto.timingSafeEqual(source, comparison)
  );
}

function verifyPayload(req, res, next) {
  const { headers, body } = req;
  const receivedSignature = headers["x-hub-signature"];
  const selfSignature = createComparisonSignature(body);
  if (!compareSignatures(selfSignature, receivedSignature)) {
    return res.writeHead(401).end("Signature mismatch!");
  }
  next();
}

function runUpdateScript() {
  console.log("\nStarting script!\n\n");
  const command = spawn("./script.sh", [process.env.REPO_PATH]);
  command.stdout.on("data", (data) => console.log(data.toString()));
  command.stderr.on("data", (data) => console.error(data.toString()));
}

polka()
  .use(json())
  .use(verifyPayload)
  .post("/", (req, res) => {
    runUpdateScript();
    res.end("Script started.");
  })
  .listen(process.env.PORT);

console.log(`Server listening at http://localhost:${process.env.PORT}`);
