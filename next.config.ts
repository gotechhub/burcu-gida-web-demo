import type { NextConfig } from 'next';
// BASE_PATH: sitenin yayınlanacağı alt klasör (ör. /respongo/tr/web-project/burcu-gida/v1).
// Boş bırakılırsa site alan adının köküne göre derlenir (yerel önizleme için).
const basePath = (process.env.BASE_PATH ?? '').replace(/\/+$/, '');
const config: NextConfig = {output:'export',trailingSlash:true,images:{unoptimized:true},poweredByHeader:false,experimental:{useTypeScriptCli:false},turbopack:{root:process.cwd()},...(basePath?{basePath}:{})};
export default config;
