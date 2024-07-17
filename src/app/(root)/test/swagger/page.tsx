"use client"
import React from "react"
// @ts-expect-error
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"

// Application Component || Define Exports
// =================================================================================================
// =================================================================================================
export default function Page() {
	return <SwaggerUI url="/api/openapi" />
}
