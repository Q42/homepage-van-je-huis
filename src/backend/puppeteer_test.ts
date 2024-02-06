import puppeteer from "puppeteer";

function extractCoordinates(str: string) {
    const match = str.match(/placeMarker\(([^,]+), ([^,]+)/);
    if (match) {
        return {
            latitude: parseFloat(match[1]),
            longitude: parseFloat(match[2])
        };
    } else {
        throw new Error("No coordinates found in the string");
    }
}

(async () => {
    // Launch the browser
    const browser = await puppeteer.launch();

    // Create a page
    const page = await browser.newPage();

    // Go to your site
    await page.goto("https://amsterdam.kunstwacht.nl/kunstwerken/bekijk/21872-auto-prikker", {
        waitUntil: "domcontentloaded"
    });
    const markerScriptString = await page.evaluate(() => {
        const scriptString = document.body.querySelector("#object_map")?.querySelector("script")?.textContent;
        return scriptString;
    });

    if (markerScriptString) {
        const coordinates = extractCoordinates(markerScriptString);
        console.log(coordinates);
    }
    // Close browser.
    await browser.close();
})();
