'use client';

export default function Loading({ loading }: { loading: boolean }) {
  if (!loading) return null;
  return <div className="text-center p-4">Loading...</div>;
}