import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  UserRound,
} from "lucide-react";
import { adminApi } from "../../services/api";

const QUICK_LOGIN_USERNAME = "admin";
const QUICK_LOGIN_PASSWORD = "viettoria@2026";

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMode, setLoadingMode] = useState<"admin" | "quick" | null>(null);

  const finishLogin = () => {
    const from =
      (location.state as { from?: { pathname: string } })?.from?.pathname ||
      "/admin/dashboard";
    navigate(from, { replace: true });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    setLoadingMode("admin");

    try {
      await adminApi.login(username.trim(), password);
      finishLogin();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Đăng nhập thất bại. Vui lòng kiểm tra kết nối và thông tin đăng nhập.",
      );
    } finally {
      setLoading(false);
      setLoadingMode(null);
    }
  };

  const handleQuickLogin = async () => {
    setError(null);
    setLoading(true);
    setLoadingMode("quick");
    try {
      await adminApi.login(QUICK_LOGIN_USERNAME, QUICK_LOGIN_PASSWORD);
      finishLogin();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Không thể đăng nhập nhanh lúc này.",
      );
    } finally {
      setLoading(false);
      setLoadingMode(null);
    }
  };

  return (
    <main className="admin-login-backdrop flex min-h-screen items-center justify-center p-3 text-charcoal sm:p-6 lg:p-8">
      <div className="admin-login-shell grid w-full max-w-[1240px] overflow-hidden border border-paper-border bg-paper shadow-[0_28px_90px_rgba(31,39,32,0.16)] lg:min-h-[700px] lg:grid-cols-[1.03fr_.97fr]">
        <section className="admin-login-heritage relative flex min-h-[260px] flex-col overflow-hidden px-6 py-6 text-paper sm:min-h-[320px] sm:px-10 sm:py-8 lg:min-h-[700px] lg:px-14 lg:py-10">
          <div
            aria-hidden="true"
            className="admin-login-grain pointer-events-none absolute inset-0"
          />
          <div
            aria-hidden="true"
            className="admin-login-halo pointer-events-none absolute inset-0"
          />
          <img
            src="/images/trong-dong.webp"
            alt=""
            aria-hidden="true"
            className="admin-login-drum pointer-events-none absolute -right-[8%] top-[4%] w-[78%] max-w-[620px] opacity-[0.18] mix-blend-screen sm:-right-[4%] sm:top-[1%] sm:w-[72%] lg:right-[-14%] lg:top-[8%] lg:w-[92%]"
          />

          <div className="relative z-10 flex items-center justify-between gap-4">
            <Link
              to="/"
              className="group inline-flex items-center gap-3"
              aria-label="Viettoria, về trang chủ"
            >
              <span className="flex h-11 w-11 items-center justify-center border border-brass/70 bg-paper/5 font-serif text-xl text-brass-light transition-colors group-hover:bg-brass/15">
                V
              </span>
              <span>
                <span className="block font-serif text-lg font-semibold tracking-[0.12em] text-paper">
                  VIETTORIA
                </span>
              </span>
            </Link>
          </div>

          <div className="relative z-10 mt-auto max-w-[500px] pb-2 pt-10 sm:pt-14 lg:pb-8 lg:pt-24">
            <p className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-brass-light">
              <span className="h-px w-8 bg-brass" />
              Không gian dành cho quản trị
              <span className="h-px w-8 bg-brass" />
            </p>
            <h1 className="max-w-[470px] font-serif text-[clamp(2.15rem,4vw,3.75rem)] font-medium leading-[1.08] tracking-[-0.025em] text-paper">
              Gìn giữ ký ức,
              <br />
              <em className="font-normal text-brass-light">
                kể tiếp câu chuyện.
              </em>
            </h1>
            <p className="mt-5 max-w-[390px] text-sm leading-7 text-paper/85 sm:text-[15px]">
              Không gian dành cho đội ngũ biên tập, quản lý tư liệu và những câu
              chuyện di sản Việt Nam.
            </p>
          </div>
        </section>

        <section className="relative flex items-center justify-center bg-paper px-6 py-9 sm:px-12 sm:py-12 lg:px-14 lg:py-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(90deg,rgba(59,43,29,.035)_1px,transparent_1px),linear-gradient(rgba(59,43,29,.035)_1px,transparent_1px)] [background-size:28px_28px]"
          />
          <div className="relative z-10 w-full max-w-[390px]">
            <Link
              to="/"
              className="mb-10 inline-flex items-center gap-2 text-[11px] font-medium text-charcoal-muted transition-colors hover:text-forest lg:absolute lg:-top-20 lg:mb-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Về trang chủ
            </Link>

            <div className="mb-8">
              <h2 className="mt-2 font-serif text-[2rem] font-medium leading-tight text-forest sm:text-[2.25rem]">
                Chào mừng trở lại
              </h2>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-2.5 border border-terracotta/35 bg-terracotta/5 px-3.5 py-3 text-sm leading-5 text-terracotta"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="admin-username"
                  className="mb-2 block text-xs font-medium text-charcoal"
                >
                  Tài khoản quản trị
                </label>
                <div className="group relative">
                  <UserRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-muted transition-colors group-focus-within:text-brass-dark" />
                  <input
                    id="admin-username"
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="Tên đăng nhập"
                    autoComplete="username"
                    className="h-12 w-full border border-paper-border bg-white/65 pl-10 pr-3.5 text-sm text-charcoal outline-none transition-[border-color,box-shadow,background-color] placeholder:text-charcoal-muted/65 hover:border-brass/60 focus:border-brass focus:bg-white focus:shadow-[0_0_0_3px_rgba(184,138,56,.12)]"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="mb-2 block text-xs font-medium text-charcoal"
                >
                  Mật khẩu
                </label>
                <div className="group relative">
                  <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-muted transition-colors group-focus-within:text-brass-dark" />
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Mật khẩu"
                    autoComplete="current-password"
                    className="h-12 w-full border border-paper-border bg-white/65 pl-10 pr-11 text-sm text-charcoal outline-none transition-[border-color,box-shadow,background-color] placeholder:text-charcoal-muted/65 hover:border-brass/60 focus:border-brass focus:bg-white focus:shadow-[0_0_0_3px_rgba(184,138,56,.12)]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-0 top-0 flex h-12 w-11 items-center justify-center text-charcoal-muted transition-colors hover:text-forest focus-visible:outline focus-visible:outline-2 focus-visible:outline-brass"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-2 bg-forest px-5 text-xs font-semibold uppercase tracking-[0.13em] text-paper transition-[background-color,transform] hover:bg-forest-light active:translate-y-px disabled:cursor-wait disabled:opacity-65"
              >
                <span>
                  {loadingMode === "admin"
                    ? "Đang xác thực…"
                    : "Đăng nhập quản trị"}
                </span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>

            <div className="my-7 flex items-center gap-3" aria-hidden="true">
              <span className="h-px flex-1 bg-paper-border" />
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-charcoal-muted/85">
                đăng nhập nhanh
              </span>
              <span className="h-px flex-1 bg-paper-border" />
            </div>

            <button
              type="button"
              onClick={() => void handleQuickLogin()}
              disabled={loading}
              className="group flex min-h-[82px] w-full items-center justify-between gap-4 border border-paper-border bg-white/45 px-4 py-3 text-left transition-colors hover:border-brass/70 hover:bg-white/80 disabled:cursor-wait disabled:opacity-60"
            >
              <span className="flex min-w-0 items-center gap-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-forest/15 bg-forest/5 text-forest transition-colors group-hover:border-brass/45 group-hover:bg-brass/10">
                  <KeyRound className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold text-forest">
                    {loadingMode === "quick"
                      ? "Đang đăng nhập…"
                      : "Đăng nhập nhanh"}
                  </span>
                  <span className="mt-1 block text-[11px] leading-4 text-charcoal-muted">
                    Username: {QUICK_LOGIN_USERNAME} · Password: {QUICK_LOGIN_PASSWORD}
                  </span>
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-charcoal-muted transition-all group-hover:translate-x-0.5 group-hover:text-brass-dark" />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminLoginPage;
