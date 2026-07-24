import { GenerateProvider } from './generate-context'

export default function ShipmentsLayout({ children }: { children: React.ReactNode }) {
  return <GenerateProvider>{children}</GenerateProvider>
}
