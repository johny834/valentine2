function copyComputedStyles(source: Element, target: Element) {
  const computedStyle = window.getComputedStyle(source);

  for (let i = 0; i < computedStyle.length; i += 1) {
    const property = computedStyle.item(i);
    if (!property) {
      continue;
    }

    (target as HTMLElement).style.setProperty(
      property,
      computedStyle.getPropertyValue(property),
      computedStyle.getPropertyPriority(property),
    );
  }

  const sourceChildren = Array.from(source.children);
  const targetChildren = Array.from(target.children);

  sourceChildren.forEach((sourceChild, index) => {
    const targetChild = targetChildren[index];
    if (targetChild) {
      copyComputedStyles(sourceChild, targetChild);
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
      } catch {
        targetImage.src = sourceUrl;
      }

      targetImage.removeAttribute("srcset");
      targetImage.removeAttribute("sizes");
      targetImage.loading = "eager";
      targetImage.decoding = "sync";
    }),
  );
}

async function waitForFonts(): Promise<void> {
  if ("fonts" in document) {
    await (document as Document & { fonts: FontFaceSet }).fonts.ready;
  }
}

export async function exportElementToPngBlob(element: HTMLElement): Promise<Blob> {
  await waitForFonts();

  const rect = element.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));

  const clonedElement = element.cloneNode(true) as HTMLElement;
  clonedElement.style.margin = "0";
  clonedElement.style.width = `${width}px`;
  clonedElement.style.height = `${height}px`;

  copyComputedStyles(element, clonedElement);
  await inlineImageSources(element, clonedElement);

  const foreignObjectMarkup = new XMLSerializer().serializeToString(clonedElement);
  const svgMarkup = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml">${foreignObjectMarkup}</div>
      </foreignObject>
    </svg>
  `;

  const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgMarkup)}`;

  return new Promise<Blob>((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const scale = Math.min(2, window.devicePixelRatio || 1);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);

      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("Canvas context not available"));
        return;
      }

      context.scale(scale, scale);
      context.drawImage(image, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Blob export failed"));
          return;
        }

        resolve(blob);
      }, "image/png");
    };

    image.onerror = () => {
      reject(new Error("Image export failed"));
    };

    image.src = svgDataUrl;
  });
}

export async function exportElementToPng(element: HTMLElement): Promise<string> {
  const blob = await exportElementToPngBlob(element);
  return blobToDataUrl(blob);
}
