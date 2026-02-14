function inlineStyles(source: Element, target: Element) {
  const computedStyle = window.getComputedStyle(source);
  let styleText = "";

  for (const property of computedStyle) {
    styleText += `${property}:${computedStyle.getPropertyValue(property)};`;
  }

  target.setAttribute("style", styleText);

  const sourceChildren = Array.from(source.children);
  const targetChildren = Array.from(target.children);

  sourceChildren.forEach((sourceChild, index) => {
    const targetChild = targetChildren[index];
    if (targetChild) {
      inlineStyles(sourceChild, targetChild);
    }
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Failed to convert blob to data URL"));
    };
    reader.onerror = () => reject(new Error("Failed to read blob"));
    reader.readAsDataURL(blob);
  });
}

async function inlineImageSources(sourceRoot: HTMLElement, targetRoot: HTMLElement): Promise<void> {
  const sourceImages = Array.from(sourceRoot.querySelectorAll("img"));
  const targetImages = Array.from(targetRoot.querySelectorAll("img"));

  await Promise.all(
    sourceImages.map(async (sourceImage, index) => {
      const targetImage = targetImages[index];
      const sourceUrl = sourceImage.currentSrc || sourceImage.src;

      if (!targetImage || !sourceUrl) {
        return;
      }

      try {
        const response = await fetch(sourceUrl, { cache: "force-cache" });
        if (!response.ok) {
          throw new Error("Image request failed");
        }

        const dataUrl = await blobToDataUrl(await response.blob());
        targetImage.src = dataUrl;
        targetImage.removeAttribute("srcset");
      } catch {
        targetImage.src = sourceUrl;
        targetImage.removeAttribute("srcset");
      }
    }),
  );
}

export async function exportElementToPng(element: HTMLElement): Promise<string> {
  const { width, height } = element.getBoundingClientRect();
  const clonedElement = element.cloneNode(true) as HTMLElement;
  inlineStyles(element, clonedElement);
  await inlineImageSources(element, clonedElement);

  const serializedNode = new XMLSerializer().serializeToString(clonedElement);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <foreignObject width="100%" height="100%">${serializedNode}</foreignObject>
    </svg>
  `;

  const image = new Image();
  const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  return new Promise<string>((resolve, reject) => {
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(width * 2);
      canvas.height = Math.round(height * 2);

      const context = canvas.getContext("2d");
      if (!context) {
        URL.revokeObjectURL(url);
        reject(new Error("Canvas context not available"));
        return;
      }

      context.scale(2, 2);
      context.drawImage(image, 0, 0);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png"));
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image export failed"));
    };

    image.src = url;
  });
}
