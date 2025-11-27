import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-md space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-stone-900">
              대화상점 인명부
            </h1>
            <p className="text-lg text-stone-600">
              참여자 관리 시스템
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button size="lg" asChild>
              <Link href="/login">Google로 로그인하기</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/participants">참여자 바로 보기</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
