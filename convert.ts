import { readdirSync } from "fs";
import { exec } from "child_process";

function run(cmd: string) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error: unknown, stdout: string, stderr: string) => {
      if (error) return reject(error);
      if (stderr) return reject(stderr);
      resolve(stdout);
    });
  });
}

async function convert() {
  const inputPath = "./input";
  const outputPath = "./output";
  const donePath = "./done";

  interface File {
    fileName: string;
  }

  interface Vr1803d extends File {
    kind: "vr-180-3d.mp4";
    rightEyeFileName: string;
  }

  interface Vr3602d extends File {
    kind: "vr-360-2d.mp4";
  }

  type VrFile = Vr1803d | Vr3602d;

  const fileNames = readdirSync(inputPath);
  const vrFiles: Array<VrFile> = [];

  for (let i = 0; i < fileNames.length; i++) {
    const fileName = fileNames[i];
    const vr1802dMatch = fileName.match(
      /^VID_([0-9]*)_([0-9]*)_([0-9]*)_([0-9]*)\.insv$/
    );
    if (vr1802dMatch) {
      if (vr1802dMatch[3] == "10") {
        // Ignore right eye file and assume it always exists for now
        continue;
      }
      vrFiles.push({
        kind: "vr-180-3d.mp4",
        fileName,
        rightEyeFileName: fileName.replace("_00_", "_10_"),
      });
    }
  }

  for (let vrFile of vrFiles) {
    console.log(vrFile);
    if (vrFile.kind == "vr-180-3d.mp4") {
      const outputFile = vrFile.fileName
        .replace("_00_", "_")
        .replace(".insv", ".mp4");
      const command = `ffmpeg -i ${inputPath}/${vrFile.fileName} -i ${inputPath}/${vrFile.rightEyeFileName} -filter_complex hstack -c:v libx264 -crf 26 ${outputPath}/${outputFile}`;
      await run(command);
    }
  }
}

convert();
