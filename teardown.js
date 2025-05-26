import fs from "fs/promises";

async function getUserId() {
  try {
    const userId = (await fs.readFile("student_id.txt", "utf-8")).trim();

    // Varsayılan değerleri kontrol et
    const defaultValues = ["123456"];

    if (!userId) {
      throw new Error("Lütfen öğrenci numaranı student_id.txt dosyasına ekle.");
    }

    if (defaultValues.includes(userId)) {
      throw new Error(
        "Öğrenci numaranı eklemeyi unutmuşsun gibi görünüyor. öğrenci numaranı student_id.txt dosyasına ekle.",
      );
    }

    return userId;
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(
        "student_id.txt dosyası bulunamadı. Bu dosyayı yarat ve içine Kaizu'da belirtilen öğrenci numaranı yaz.",
      );
    }
    throw error;
  }
}

export default async function globalTeardown() {
  try {
    const userId = await getUserId();
    console.log(`Running tests for student ID: ${userId}`);

    const reportRaw = await fs.readFile("playwright-report.json", "utf-8");
    const report = JSON.parse(reportRaw);

    const stats = report.stats;
    const total = stats.expected + stats.unexpected + stats.skipped +
      stats.flaky;
    const passed = stats.expected;

    const css = await fs.readFile("style.css", "utf-8");
    const html = await fs.readFile("index.html", "utf-8");

    const payload = {
      is_auto: true,
      project_id: 463,
      user_files: {
        "/style.css": {
          code: css,
        },
        "/index.html": {
          code: html,
        },
      },
      "user_id": userId,
      "user_score": total > 0 ? ((passed / total) * 100).toFixed() : -1,
    };

    // Endpoint'e gönder
    await sendTestResults(payload);
  } catch (error) {
    console.error("Error in teardown:", error);
  }
}

async function sendTestResults(results) {
  try {
    const response = await fetch(
      "https://edugen-backend-487d2168bc6c.herokuapp.com/projectLog/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(results),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Failed to send test results:", error);
  }
}
