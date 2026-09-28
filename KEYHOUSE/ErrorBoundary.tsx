import { Component, type ErrorInfo, type ReactNode } from 'react';
import { LogoMark } from './Logo';

interface State {
  error: Error | null;
}

/** Rede de segurança: em vez de uma página em branco, mostra uma saída elegante com recuperação. */
export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[KEYHOUSE] Erro inesperado:', error, info.componentStack);
  }

  private reset = () => {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith('keyhouse-properties'))
        .forEach((k) => localStorage.removeItem(k));
    } catch {
      /* ignore */
    }
    window.location.hash = '#/';
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-950 px-6 text-center text-white">
        <div className="max-w-md">
          <LogoMark className="mx-auto h-16 w-16" />
          <div className="mt-6 text-[11px] font-bold uppercase tracking-[.25em] text-gold-300">KEYHOUSE PROPERTIES</div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Algo correu mal.</h1>
          <p className="mt-3 leading-relaxed text-white/70">
            Pedimos desculpa pelo incómodo. Normalmente resolve-se repondo os dados de demonstração guardados neste navegador.
          </p>
          <button
            onClick={this.reset}
            className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-linear-to-b from-gold-300 to-gold-500 px-6 text-sm font-bold text-navy-950 shadow-gold"
          >
            Repor dados e recarregar
          </button>
          <p className="mt-6 break-words text-xs text-white/35">{this.state.error.message}</p>
        </div>
      </div>
    );
  }
}
