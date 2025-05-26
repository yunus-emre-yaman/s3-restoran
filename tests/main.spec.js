import { expect, test } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test.describe("HTML ve CSS Görevleri", () => {
  let page;

  test.beforeAll(async ({ browser }) => {
    const htmlPath = path.resolve(__dirname, "../index.html");
    const htmlContent = fs.readFileSync(htmlPath, "utf-8");

    const cssPath = path.resolve(__dirname, "../style.css");
    const cssContent = fs.readFileSync(cssPath, "utf-8");

    const fullHtml = `
      <html>
        <head>
          <style>${cssContent}</style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `;

    page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: "domcontentloaded" });
  });

  //
  // 🔸 HTML TESTLERİ
  //

  test("meta charset etiketi var mı?", async () => {
    const meta = await page.$("meta[charset]");
    expect(meta).not.toBeNull();
  });

  test("style.css dosyası entegre edildi mi (örnek stil uygulandı mı)?", async () => {
    const html = await page.$("html");
    const color = await page.evaluate(
      (el) => getComputedStyle(el).color,
      html,
    );
    expect(color).toBe("rgb(8, 8, 8)");
  });

  test("sayfa başlığı doğru mu?", async () => {
    const title = await page.title();
    expect(title).toContain("Nefis Lezzet");
  });

  test("main elementinde container class'ı var mı?", async () => {
    const main = await page.$("main.container");
    expect(main).not.toBeNull();
  });

  test("restoran adı uygun bir başlık etiketi içinde mi?", async () => {
    const h1 = await page.$("h1");
    expect(h1).not.toBeNull();
    const text = await h1.innerText();
    expect(text.toLowerCase()).toContain("nefis lezzet");
  });

  test("nav etiketi mainMenu class'ına sahip mi?", async () => {
    const nav = await page.$("nav.mainMenu");
    expect(nav).not.toBeNull();
  });

  test("nav içinde 5 adet link var mı?", async () => {
    const links = await page.$$("nav.mainMenu a");
    expect(links.length).toBe(5);
  });

  test("banner görseli doğru şekilde eklenmiş mi?", async () => {
    const img = await page.$("img[src*='banner.jpg']");
    expect(img).not.toBeNull();
  });

  test("hakkımızda, menümüz, galeri, iletişim bölümleri başlık ve açıklama olarak uygun etiketle ayrılmış mı?", async () => {
    const sections = ["Hakkımızda", "Menümüz", "Galeri", "İletişim"];
    for (const title of sections) {
      const heading = await page.$(`text="${title}"`);
      expect(heading).not.toBeNull();
    }
  });

  test("iletişim kısmı bir sırasız liste (ul) içinde mi?", async () => {
    const ul = await page.$("ul");
    expect(ul).not.toBeNull();
  });

  //
  // 🔸 CSS TESTLERİ
  //

  test("body stil: background-color ve margin", async () => {
    const body = await page.$("body");
    const style = await page.evaluate((el) => getComputedStyle(el), body);
    expect(style.backgroundColor).toBe("rgb(231, 153, 71)");
    expect(style.margin).toBe("0px");
  });

  test("h1 stil: font-size ve text-align", async () => {
    const h1 = await page.$("h1");
    const style = await page.evaluate((el) => getComputedStyle(el), h1);
    expect(style.fontSize).toBe("60px");
    expect(style.textAlign).toBe("center");
  });

  test("mainMenu nav stil: text-align, padding, font-size", async () => {
    const nav = await page.$("nav.mainMenu");
    const style = await page.evaluate((el) => getComputedStyle(el), nav);
    expect(style.textAlign).toBe("center");
    expect(style.padding).toBe("10px");
    expect(style.fontSize).toBe("20px");
  });

  test("<p> etiketlerinin stil kontrolü", async () => {
    const p = await page.$("p");
    const style = await page.evaluate((el) => getComputedStyle(el), p);
    expect(style.fontSize).toBe("15px");
    expect(style.fontFamily.toLowerCase()).toContain("arial");
    expect(style.padding).toBe("10px");
    expect(style.lineHeight).toBe("22.5px"); // 15px * 1.5
    expect(style.margin).toBe("0px");
  });

  test("img stil: border-radius ve width", async () => {
    const img = await page.$("img");
    const style = await page.evaluate((el) => getComputedStyle(el), img);
    expect(style.borderRadius).toBe("10px");
    expect(style.width).toBe("750px");
  });

  test("ul stil: margin ve line-height", async () => {
    const ul = await page.$("ul");
    const style = await page.evaluate((el) => getComputedStyle(el), ul);
    expect(style.marginLeft).toBe("10px");
    expect(style.marginRight).toBe("10px");
    expect(style.lineHeight).toBe("24px");
  });

  test(".container stil: width, margin, background-color, padding", async () => {
    const container = await page.$(".container");
    const style = await page.evaluate((el) => getComputedStyle(el), container);
    expect(style.width).toBe("750px");
    expect(style.backgroundColor).toBe("rgb(255, 255, 255)");
    expect(style.padding).toBe("50px");
  });
});
