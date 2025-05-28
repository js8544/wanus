import { registerOTel } from '@vercel/otel'
import { AISDKExporter } from 'langsmith/vercel'

export function register() {
  registerOTel({
    serviceName: 'wanus-ai-sdk',
    traceExporter: new AISDKExporter(),
  })
} 
