'use client';
import { useState, useRef } from 'react';

export default function WeddingInvitation() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [attendance, setAttendance] = useState<string | null>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#FDFBF7] text-[#2C2C2C] p-6 selection:bg-[#E8DCC4]">
      {/* Аудио файл (музыка) */}
      <audio ref={audioRef} src="/toymusic.mp3" loop />

      {/* Басты музыканы қосу батырмасы */}
      <button 
        onClick={togglePlay}
        className="mb-8 px-5 py-2.5 bg-[#D4AF37] text-white rounded-full shadow-md hover:bg-[#C59B27] transition flex items-center gap-2 text-sm font-medium"
      >
        {isPlaying ? '🎵 Әуен тоқтату' : '▶️ Әуенді қосу'}
      </button>

      {/* Шақыру қағазының негізгі блоктары */}
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-[#EFECE6]">
        
        <p className="tracking-widest text-xs uppercase text-[#8C8C8C] mb-3">
          ҮЙЛЕНУ ТОЙЫНА ШАҚЫРУ
        </p>

        <h1 className="text-4xl font-serif text-[#3A3A3A] mb-4">
          Ермек & Айгерім
        </h1>

        <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto my-6"></div>

        <p className="text-sm leading-relaxed text-[#5A5A5A] mb-6">
          Құрметті туыстар, бауырлар, достар мен әріптестер! 
          Сіздерді ұлы қуанышымыз — шаңырақ көтеру тойыбыздың қадірлі қонағы болуға шақырамыз.
        </p>

        <div className="bg-[#F9F8F6] p-4 rounded-xl mb-6 text-sm text-[#4A4A4A]">
          <p className="font-semibold mb-1">📅 Күні:</p>
          <p className="mb-3">2026 жыл, 15 қазан</p>
          <p className="font-semibold mb-1">📍 Мекенжайы:</p>
          <p>«Алтын Сарай» мейрамханасы, Алматы қаласы</p>
        </div>

        {/* Қонақтың келетін-келмейтінін растау бөлімі (RSVP) */}
        <div className="mt-6">
          <p className="text-sm font-medium mb-3 text-[#3A3A3A]">
            Тойға келесіз бе? Жауабыңызды белгілеңіз:
          </p>
          
          {!attendance ? (
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setAttendance('Келеді')}
                className="px-5 py-2 bg-[#4A6B5D] text-white rounded-lg text-sm hover:bg-[#3D574C] transition"
              >
                Келем ✨
              </button>
              <button 
                onClick={() => setAttendance('Келмейді')}
                className="px-5 py-2 bg-[#A36B6B] text-white rounded-lg text-sm hover:bg-[#8E5A5A] transition"
              >
                Келмеймін 😔
              </button>
            </div>
          ) : (
            <p className="text-sm font-medium text-[#4A6B5D] bg-[#F0F5F2] py-2 rounded-lg">
              Жауабыңыз қабылданды: {attendance}! Рахмет! 🥂
            </p>
          )}
        </div>

      </div>

      <footer className="mt-8 text-xs text-[#9C9C9C]">
        Toy Digital Invitation © 2026
      </footer>
    </main>
  );
}
