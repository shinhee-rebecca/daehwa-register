import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart3,
  CheckCircle2,
  FileSpreadsheet,
  Filter,
  ListChecks,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const featureHighlights = [
  {
    title: "정교한 검색",
    description: "성별, 나이, 등록월, 회비, 재등록 여부까지 15명 단위로 빠르게 조회.",
    icon: Filter,
  },
  {
    title: "권한 제어",
    description: "운영자는 전체, 리더는 담당 모임만 확인하는 역할 기반 접근.",
    icon: ShieldCheck,
  },
  {
    title: "Excel 연동",
    description: "현재 페이지 또는 전체 검색 결과를 바로 엑셀로 내보내기 준비 중.",
    icon: FileSpreadsheet,
  },
];

const workflowSteps = [
  {
    title: "Google로 인증",
    description: "등록된 계정만 접근하도록 보호하고, 권한을 자동으로 확인합니다.",
  },
  {
    title: "필터로 탐색",
    description: "필요한 기준을 조합해 참여자를 추리고, 15명씩 깔끔하게 살펴봅니다.",
  },
  {
    title: "작업 기록",
    description: "수정·삭제·추가가 끝나면 바로 다음 검색이나 내보내기로 이어집니다.",
  },
];

const governanceItems = [
  {
    title: "운영자 모드",
    description: "참여자 CRUD, 리더 등록/해제, 모임 관리까지 한 화면에서 처리.",
  },
  {
    title: "리더 모드",
    description: "담당 모임의 참여자만 보여주는 집중 뷰로 검색과 확인에 집중.",
  },
  {
    title: "데이터 일관성",
    description: "Zod 검증과 Supabase 스키마로 전화번호·등록월 등 형식을 통일.",
  },
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 -top-64 -z-10 h-[420px] bg-gradient-to-r from-primary/10 via-secondary/25 to-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-1/3 bg-gradient-to-b from-primary/5 via-white to-transparent blur-3xl" />

      <main className="container mx-auto px-4 pb-16 pt-12 lg:pb-24 lg:pt-16">
        <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <Badge variant="secondary" className="px-3 py-1 text-xs font-semibold uppercase">
              대화상점 참여자 허브
            </Badge>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight text-stone-900 sm:text-5xl">
                운영자와 리더를 위한
                <br />
                단단한 인명부 홈
              </h1>
              <p className="text-lg text-stone-600 sm:text-xl">
                Google 로그인으로 안전하게 접속하고, 필요한 정보만 빠르게 찾고, 엑셀로 깔끔하게
                공유하세요. 대화상점 독서모임을 위한 실무형 관리 화면입니다.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Button size="lg" asChild>
                <Link href="/login">로그인하고 시작하기</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/participants">참여자 바로 보기</Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-stone-600">
              <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1">
                <ShieldCheck className="h-4 w-4 text-primary" />
                역할 기반 접근
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1">
                <Sparkles className="h-4 w-4 text-primary" />
                15명 페이징 · 세부 검색
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1">
                <FileSpreadsheet className="h-4 w-4 text-primary" />
                Excel 내보내기 준비
              </span>
            </div>
          </div>

          <Card className="border-primary/20 shadow-lg shadow-primary/5 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold">오늘의 현황</CardTitle>
                <CardDescription>실시간으로 정돈된 참여자 요약</CardDescription>
              </div>
              <Badge className="bg-primary text-primary-foreground">Live</Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border bg-gradient-to-b from-primary/5 to-white p-4">
                  <p className="text-xs font-semibold text-stone-500">참여자</p>
                  <p className="mt-2 text-3xl font-bold text-stone-900">312</p>
                  <p className="mt-1 text-xs text-green-600">+8 신규 등록</p>
                </div>
                <div className="rounded-xl border bg-gradient-to-b from-stone-50 to-white p-4">
                  <p className="text-xs font-semibold text-stone-500">리더</p>
                  <p className="mt-2 text-3xl font-bold text-stone-900">18</p>
                  <p className="mt-1 text-xs text-stone-500">모임별 권한 적용</p>
                </div>
                <div className="rounded-xl border bg-gradient-to-b from-stone-50 to-white p-4">
                  <p className="text-xs font-semibold text-stone-500">필터 저장</p>
                  <p className="mt-2 text-3xl font-bold text-stone-900">9</p>
                  <p className="mt-1 text-xs text-stone-500">즐겨찾는 검색 기준</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-xl border bg-stone-50/60 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Filter className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">세밀한 필터</p>
                    <p className="text-xs text-stone-600">
                      성별, 나이, 등록월, 회비, 재등록 여부를 한 번에 결합
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border bg-stone-50/60 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileSpreadsheet className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">다운로드 준비</p>
                    <p className="text-xs text-stone-600">
                      현재 페이지 · 전체 검색 결과를 엑셀로 내보내기 대응
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 text-sm text-stone-700">
                <BarChart3 className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-stone-900">운영 통계와 함께</p>
                  <p className="text-xs text-stone-600">
                    모임별 분포, 회비 현황, 재등록 추이를 한눈에 확인할 수 있도록 확장 중입니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-16 space-y-8 lg:mt-20">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold text-stone-900">무엇을 바로잡나요?</h2>
            <p className="text-stone-600">
              정보가 흩어지지 않도록, 대화상점 운영 흐름에 맞춘 핵심 기능들만 담았습니다.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {featureHighlights.map((feature) => (
              <Card key={feature.title} className="h-full border-stone-200">
                <CardHeader className="space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-stone-900">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-stone-600">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-8 lg:mt-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-stone-900">운영 흐름에 맞춘 워크플로우</h3>
            <p className="text-stone-600">
              로그인부터 검색, 수정, 내보내기까지 운영자가 매일 반복하는 단계를 기준으로 설계했습니다.
            </p>
            <div className="space-y-4">
              {workflowSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="flex items-start gap-3 rounded-xl border bg-white/90 p-4 shadow-sm"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <ListChecks className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-stone-900">
                      {index + 1}. {step.title}
                    </p>
                    <p className="text-sm text-stone-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card className="border-stone-200 bg-gradient-to-br from-stone-50 to-white shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-stone-900">
                  역할별 가이드라인
                </CardTitle>
                <CardDescription>운영자와 리더가 바로 이해하는 책임 구분</CardDescription>
              </div>
              <Users className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent className="space-y-4">
              {governanceItems.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-base font-semibold text-stone-900">{item.title}</p>
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <p className="mt-2 text-sm text-stone-600">{item.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="mt-16 lg:mt-20">
          <Card className="overflow-hidden border-primary/20 bg-gradient-to-r from-primary/10 via-white to-primary/5 shadow-lg">
            <CardContent className="flex flex-col justify-between gap-8 p-8 lg:flex-row lg:items-center">
              <div className="space-y-3">
                <h4 className="text-2xl font-semibold text-stone-900">지금 바로 시작하세요</h4>
                <p className="text-stone-700">
                  이미 Google 계정이 등록되어 있다면 로그인만 하면 됩니다. 참여자 관리, 모임별 리더
                  권한, 엑셀 내보내기까지 한 곳에서 이어집니다.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <Button size="lg" asChild>
                  <Link href="/login">로그인</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/participants">데이터 살펴보기</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
