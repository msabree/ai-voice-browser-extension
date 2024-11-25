import * as React from "react"
import { SVGProps } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <path fill="#000" d="M5 3a3 3 0 0 1 6 0v4a3 3 0 0 1-6 0V3Z" />
    <path
      fill="#000"
      d="M9 13.93V16H7v-2.07A7.001 7.001 0 0 1 1 7V6h2v1a5 5 0 0 0 10 0V6h2v1a7.001 7.001 0 0 1-6 6.93Z"
    />
  </svg>
)
export default SvgComponent

