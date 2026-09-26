// Web Audio API Synthesizer for Zen Wooden Fish & Meditation Chimes
class SoundEffects {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // 木鱼敲击声 (Crisp woody click with hollow body resonance)
  playWoodenFish() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      // Click transient
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(620, t);
      osc1.frequency.exponentialRampToValueAtTime(140, t + 0.08);

      gain1.gain.setValueAtTime(0.7, t);
      gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(t);
      osc1.stop(t + 0.1);

      // Hollow body resonance
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(320, t);
      osc2.frequency.exponentialRampToValueAtTime(180, t + 0.15);

      gain2.gain.setValueAtTime(0.4, t);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(t);
      osc2.stop(t + 0.16);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // 空灵磬钟声 (Warm singing bowl / bell harmonic chime)
  playChime(freq = 528) {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      // Fundamental tone
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, t);

      gain1.gain.setValueAtTime(0.35, t);
      gain1.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(t);
      osc1.stop(t + 2.5);

      // Harmonic overtone
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2.76, t); // inharmonic bell chime

      gain2.gain.setValueAtTime(0.12, t);
      gain2.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(t);
      osc2.stop(t + 1.8);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // 翻页纸香沙沙声 (Soft subtle paper rustle)
  playPaperFlip() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const bufferSize = this.ctx.sampleRate * 0.06;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800;

      const gain = this.ctx.createGain();
      gain.gain.value = 0.08;

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch (e) {
      console.warn('Paper sound error:', e);
    }
  }
}

export const sound = new SoundEffects();
