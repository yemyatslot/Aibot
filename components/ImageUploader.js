// components/ImageUploader.js
import { useState } from 'react';
import Tesseract from 'tesseract.js';

export default function ImageUploader({ onResult }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);

    setLoading(true);
    try {
      const { data } = await Tesseract.recognize(file, 'eng+mya', {
        logger: m => {
          // Optional progress logging
          // console.log(m);
        }
      });
      const text = data?.text || '';
      onResult({ text, file, preview: url });
    } catch (err) {
      console.error('OCR error', err);
      onResult({ text: '', file, preview: url, error: err?.message });
    }
    setLoading(false);
  }

  return (
    <div>
      <label style={{ display: 'block', marginBottom: 8 }}>
        Upload problem screenshot (PNG/JPG):
      </label>
      <input type="file" accept="image/*" onChange={handleFile} />
      {preview && (
        <div style={{ marginTop: 8 }}>
          <img src={preview} alt="preview" style={{ maxWidth: 300 }} />
        </div>
      )}
      {loading && <div>OCR running...</div>}
    </div>
  );
      }
