import { useState, useRef, useEffect } from 'react';
import logo from '../../public/remologo.png'; 

export default function UploadPage() {
  const [showWelcome, setShowWelcome] = useState(true); // Welcome state
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedBg, setSelectedBg] = useState('transparent');
  
  const fileInputRef = useRef(null);

  const colors = [
    { id: 'transparent', value: 'transparent', label: 'Transparent' },
    { id: 'white', value: '#ffffff', label: 'Studio White' },
    { id: 'zinc', value: '#18181b', label: 'Zinc' },
    { id: 'slate', value: '#334155', label: 'Slate' },
    { id: 'soft-indigo', value: '#e0e7ff', label: 'Ice' },
    { id: 'grad-dark', value: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)', label: 'Midnight' },
    { id: 'grad-premium', value: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)', label: 'Royal' },
    { id: 'grad-mesh', value: 'linear-gradient(135deg, #f472b6 0%, #6366f1 100%)', label: 'Mesh' },
  ];

  const processFile = (selectedFile) => {
    if (!selectedFile) {
      setFile(null); setPreview(null); setResult(null); setStatus('idle');
      return;
    }
    setFile(selectedFile);
    setStatus('idle');
    setResult(null);
    setPreview(URL.createObjectURL(selectedFile));
  };
 
  const handleUpload = async () => {
    if (!file) return;
    setStatus('loading');
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch('https://overemphatically-spotty-karyn.ngrok-free.dev/api/background/remove', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Processing failed');
      const blob = await res.blob();
      setResult(URL.createObjectURL(blob));
      setStatus('success');
    } catch (err) {
      setErrorMsg(err.message);
      setStatus('error');
    }
  };

  const handleExport = () => {
    if (!result) return;
    if (selectedBg === 'transparent') {
      const link = document.createElement('a');
      link.href = result;
      link.download = 'remo-transparent.png';
      link.click();
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = result;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;

      if (selectedBg.includes('gradient')) {
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        if (selectedBg.includes('#6366f1')) {
          grad.addColorStop(0, '#6366f1'); grad.addColorStop(1, '#4338ca');
        } else if (selectedBg.includes('#0f172a')) {
          grad.addColorStop(0, '#0f172a'); grad.addColorStop(1, '#334155');
        } else {
          grad.addColorStop(0, '#f472b6'); grad.addColorStop(1, '#6366f1');
        }
        ctx.fillStyle = grad;
      } else {
        ctx.fillStyle = selectedBg;
      }
      
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const link = document.createElement('a');
      link.download = 'remo-export.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
  };

  const checkerboardBg = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYNgNwEg1gIFRDUAQAKBgZCxg/P//PwMFH0MwU8jA2EAxQAMjQzQeAAD1hgcH9V+QfwAAAABJRU5ErkJggg==')";

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 flex flex-col items-center justify-center p-6 transition-colors duration-700 font-sans relative">
      
      {/* --- WELCOME SCREEN OVERLAY --- */}
      {showWelcome && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-700">
          <div className="absolute inset-0 bg-white/20 dark:bg-black/40 backdrop-blur-[60px]"></div>
          
          <div className="relative bg-white/40 dark:bg-zinc-900/40 border border-white/20 dark:border-zinc-800/50 p-10 md:p-16 rounded-[3rem] shadow-2xl text-center max-w-lg transition-all transform scale-100 hover:scale-[1.02]">
            <img src={logo} alt="remo" className="h-12 w-auto  mx-auto mb-8 dark: opacity-80" />
            
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4 leading-tight">
              Welcome my dearest <span className="text-indigo-600 dark:text-indigo-400">Manjurul Bro</span>, <br />
              <span className="text-zinc-600 dark:text-zinc-300 font-medium text-xl">I hope you enjoy this tool.</span>
            </h2>
            
            <p className="text-zinc-500 text-sm mb-10 leading-relaxed font-medium">
              We've prepared the professional AI engine for your creative workflow.
            </p>
            
            <button 
              onClick={() => setShowWelcome(false)}
              className="px-10 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold text-sm tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-xl"
            >
              ENTER ENGINE
            </button>
          </div>
        </div>
      )}

      {/* --- MAIN PAGE CONTENT (Intact) --- */}
      <nav className="fixed top-0 w-full flex justify-center py-8 z-10">
        <div className="flex flex-col items-center gap-2">
          <img src={logo} alt="remo" className="h-10 w-auto grayscale dark:invert opacity-100 transition-all hover:opacity-100" />
          <span className="text-[10px] tracking-[0.4em] font-bold text-zinc-400 uppercase">Professional Engine</span>
        </div>
      </nav>

      <div className="relative w-full max-w-[550px] mt-12">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative bg-white dark:bg-zinc-900/80 backdrop-blur-2xl w-full p-8 rounded-[2.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] border border-zinc-200/50 dark:border-zinc-800/50 flex flex-col gap-8 transition-all overflow-hidden">
          
          {!result ? (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                  Visual <span className="text-indigo-600">Remover</span>
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2 font-medium">Industry-standard background isolation.</p>
              </div>

              <div 
                className={`group relative aspect-[1.6/1] border-2 border-dashed rounded-[2rem] transition-all duration-500 flex flex-col items-center justify-center cursor-pointer overflow-hidden
                  ${isDragging ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-500/5' : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600'}
                  ${preview ? 'border-none' : ''}
                `}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); processFile(e.dataTransfer.files[0]); }}
                onClick={() => !preview && fileInputRef.current?.click()}
              >
                <input type="file" hidden ref={fileInputRef} onChange={(e) => processFile(e.target.files[0])} accept="image/*" />
                
                {!preview ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-indigo-500 transition-colors shadow-sm">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    </div>
                    <span className="text-sm font-semibold text-zinc-500">Drop raw image assets here</span>
                  </div>
                ) : (
                  <img src={preview} alt="Input" className={`w-full h-full object-cover rounded-[1.8rem] transition-all ${status === 'loading' ? 'blur-sm opacity-50' : ''}`} />
                )}
              </div>

              {preview && status !== 'loading' && (
                <button 
                  onClick={handleUpload} 
                  className="w-full py-4 rounded-2xl font-bold text-sm tracking-wide text-white bg-zinc-900 dark:bg-white dark:text-black hover:opacity-90 transition-all shadow-xl"
                >
                  START PROCESSING
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Processed Result</h2>
                  <p className="text-xs text-zinc-500 font-medium">Ready for export</p>
                </div>
                <button onClick={() => processFile(null)} className="p-2 text-zinc-400 hover:text-red-500 transition-colors">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div 
                className="relative rounded-[2rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl aspect-square flex items-center justify-center transition-all duration-700"
                style={{ 
                  background: selectedBg.includes('gradient') || selectedBg !== 'transparent' ? selectedBg : '',
                  backgroundImage: selectedBg === 'transparent' ? checkerboardBg : '' 
                }}
              >
                 <img src={result} alt="Result" className="max-w-[85%] max-h-[85%] object-contain drop-shadow-2xl" />
              </div>

              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Environment Preset</span>
                <div className="flex flex-wrap gap-4 items-center">
                  {colors.map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => setSelectedBg(bg.value)}
                      className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 overflow-hidden relative ${selectedBg === bg.value ? 'border-indigo-500 ring-4 ring-indigo-500/10 scale-110' : 'border-zinc-100 dark:border-zinc-800'}`}
                    >
                      {bg.value === 'transparent' && (
                        <div className="absolute inset-0" style={{ backgroundImage: checkerboardBg }}></div>
                      )}
                      <div className="absolute inset-0" style={{ background: bg.value }}></div>
                    </button>
                  ))}
                  <label className="w-10 h-10 rounded-full border-2 border-zinc-100 dark:border-zinc-800 cursor-pointer flex items-center justify-center hover:scale-110 transition-all bg-zinc-50 dark:bg-zinc-800 group overflow-hidden">
                    <svg className="w-4 h-4 text-zinc-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <input type="color" className="absolute opacity-0 pointer-events-none" onChange={(e) => setSelectedBg(e.target.value)} />
                  </label>
                </div>
              </div>

              <button 
                onClick={handleExport}
                className="w-full py-4 rounded-2xl font-bold text-sm tracking-widest text-white bg-indigo-600 hover:bg-indigo-500 transition-all text-center shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
              >
                DOWNLOAD WITH BACKGROUND
              </button>
            </div>
          )}

          {status === 'loading' && (
            <div className="absolute inset-0 z-20 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
               <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
               <p className="text-xs font-bold tracking-widest text-indigo-600 animate-pulse">ANALYZING...</p>
            </div>
          )}
        </div>
      </div>

      <footer className="mt-12 text-zinc-400 text-[10px] font-bold tracking-[0.2em] uppercase">
        End-to-end Encrypted • GPU Powered
      </footer>
    </div>
  );
}