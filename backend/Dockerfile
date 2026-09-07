# Build stage
FROM golang:1.27-alpine AS builder

WORKDIR /app

# Install git and ca-certificates
RUN apk add --no-cache git ca-certificates tzdata

# Cache go modules
COPY go.mod go.sum ./
RUN go mod download

# Copy source
COPY . .

# Build statically linked binary
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /app/server cmd/main.go

# Production stage
FROM alpine:3.19

WORKDIR /app

RUN apk --no-cache add ca-certificates tzdata

# Copy binary from builder
COPY --from=builder /app/server /app/server

# Expose Go Gin port
EXPOSE 8080

# Run server
ENTRYPOINT ["/app/server"]
