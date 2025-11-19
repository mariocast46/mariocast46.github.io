// src/components/MosaicOverlay.jsx
"use client";
import PixelMosaic from "./PixelMosaic";

/**
 * Wrapper para superponer el mosaico sobre cualquier contenido.
 * - Respeta el tamaño del contenedor (usa aspect-ratio/width/height por CSS).
 * - Mezcla por defecto con difference (coherente con tu look).
 */
export default function MosaicOverlay({
  className = "",
  blend = "difference",
  mosaicProps = {},     // props que se pasan a PixelMosaic (cols,rows,rate,pulse…)
}) {
  return (
    <div className={`mosaic-wrap ${className}`} aria-hidden="true">
      <PixelMosaic {...mosaicProps} />
      <style jsx>{`
        .mosaic-wrap{
          position:absolute;
          inset:0;
          pointer-events:none;
          mix-blend-mode:${blend};
        }
        .mosaic-wrap :global(svg){
          width:100%; height:100%; display:block;
        }
      `}</style>
    </div>
  );
}
