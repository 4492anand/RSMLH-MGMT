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
                    bat 'gradlew.bat clean build -x test'
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }
        
        stage('Deploy Backend') {
            steps {
                script {
                    // Kill existing backend process
                    bat '''
                        for /f "tokens=5" %%a in ('netstat -aon ^| find ":8081" ^| find "LISTENING"') do taskkill /F /PID %%a
                    ''' 
                    
                    // Start backend
                    dir('backend') {
                        bat 'start "backend" java -jar build\\libs\\*.jar --server.port=8081'
                    }
                    
                    sleep 10
                }
            }
        }
        
        stage('Deploy Frontend') {
            steps {
                script {
                    // Kill existing frontend process
                    bat '''
                        for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do taskkill /F /PID %%a
                    '''
                    
                    // Start frontend
                    dir('frontend') {
                        bat 'start "frontend" npm run preview -- --port 3000'
                    }
                    
                    sleep 5
                }
            }
        }
        
        stage('Health Check') {
            steps {
                bat 'curl -f http://localhost:8081/actuator/health || echo Backend check failed'
                bat 'curl -f http://localhost:3000 || echo Frontend check failed'
            }
        }
    }
}
