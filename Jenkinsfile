pipeline {
    agent any
    
    environment {
        BACKEND_PORT = '8081'
        FRONTEND_PORT = '3000'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'rsmlh-ui-dev', url: 'https://github.com/4492anand/RSMLH-MGMT.git'
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh './gradlew clean build -x test'
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }
        
        stage('Deploy Backend') {
            steps {
                script {
                    // Kill existing backend process
                    sh 'kill $(lsof -t -i:8081) || true'
                    
                    // Start backend
                    dir('backend') {
                        sh 'nohup java -jar build/libs/*.jar --server.port=8081 > backend.log 2>&1 &'
                    }
                    
                    sleep 10
                }
            }
        }
        
        stage('Deploy Frontend') {
            steps {
                script {
                    // Kill existing frontend process
                    sh 'kill $(lsof -t -i:3000) || true'
                    
                    // Start frontend
                    dir('frontend') {
                        sh 'nohup npm run preview -- --port 3000 > frontend.log 2>&1 &'
                    }
                    
                    sleep 5
                }
            }
        }
        
        stage('Health Check') {
            steps {
                sh 'curl -f http://localhost:8081/actuator/health || echo Backend check failed'
                sh 'curl -f http://localhost:3000 || echo Frontend check failed'
            }
        }
    }
}
