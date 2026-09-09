import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function MobileControls({ onMoveLeftStart, onMoveLeftEnd, onMoveRightStart, onMoveRightEnd }) {
  return (
    <div className="w-full max-w-md mx-auto px-6 py-3 flex justify-between items-center gap-6 z-30 select-none pb-5">
      {/* Left Touch Button */}
      <button
        type="button"
        onPointerDown={(e) => {
          e.preventDefault();
          onMoveLeftStart();
        }}
        onPointerUp={(e) => {
          e.preventDefault();
          onMoveLeftEnd();
        }}
        onPointerLeave={(e) => {
          e.preventDefault();
          onMoveLeftEnd();
        }}
        onPointerCancel={(e) => {
          e.preventDefault();
          onMoveLeftEnd();
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          onMoveLeftStart();
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          onMoveLeftEnd();
        }}
        className="flex-1 h-16 sm:h-20 rounded-3xl bg-white/80 hover:bg-white active:bg-pastel-pink/50 active:scale-95 transition-all duration-100 flex items-center justify-center gap-2 text-pastel-deepPurple font-black text-lg shadow-cute border-2 border-white/90 glass-card touch-none select-none"
        aria-label="Move Left"
      >
        <ArrowLeft className="w-7 h-7 sm:w-8 sm:h-8 text-pastel-deepPink" />
        <span className="text-sm sm:text-base font-extrabold text-pastel-deepPurple">LEFT</span>
      </button>

      {/* Right Touch Button */}
      <button
        type="button"
        onPointerDown={(e) => {
          e.preventDefault();
          onMoveRightStart();
        }}
        onPointerUp={(e) => {
          e.preventDefault();
          onMoveRightEnd();
        }}
        onPointerLeave={(e) => {
          e.preventDefault();
          onMoveRightEnd();
        }}
        onPointerCancel={(e) => {
          e.preventDefault();
          onMoveRightEnd();
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          onMoveRightStart();
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          onMoveRightEnd();
        }}
        className="flex-1 h-16 sm:h-20 rounded-3xl bg-white/80 hover:bg-white active:bg-pastel-pink/50 active:scale-95 transition-all duration-100 flex items-center justify-center gap-2 text-pastel-deepPurple font-black text-lg shadow-cute border-2 border-white/90 glass-card touch-none select-none"
        aria-label="Move Right"
      >
        <span className="text-sm sm:text-base font-extrabold text-pastel-deepPurple">RIGHT</span>
        <ArrowRight className="w-7 h-7 sm:w-8 sm:h-8 text-pastel-deepPink" />
      </button>
    </div>
  );
}
