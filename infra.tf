provider "aws" {
  region = "us-west-2"
}

resource "aws_security_group" "demo_security_group" {
  name = "aikido-demo-security-group"

  ingress {
    description = "DEMO ONLY - insecure SSH access"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"

    # Intentionally insecure:
    # SSH available from anywhere on the internet
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_s3_bucket" "demo_bucket" {
  bucket = "aikido-marketing-demo-example"

  # Intentionally insecure configuration
  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "demo_bucket_access" {
  bucket = aws_s3_bucket.demo_bucket.id

  # DEMO ONLY: intentionally allowing public access
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}
