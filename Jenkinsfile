pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build and Test') {
            steps {
                sh './gradlew clean test bootWar'
            }
            post {
                always {
                    junit allowEmptyResults: true,
                          testResults: 'build/test-results/test/*.xml'
                }
            }
        }

        stage('Verify WAR') {
            steps {
                sh 'test -f build/libs/employee-management-system.war'
                sh 'ls -lh build/libs/'
            }
        }

        stage('Archive Artifact') {
            steps {
                archiveArtifacts artifacts: 'build/libs/*.war', fingerprint: true
            }
        }
    }

    post {
        success {
            echo 'Application build completed successfully'
        }
        failure {
            echo 'Pipeline failed. Review the console output.'
        }
        always {
            echo 'Pipeline execution completed'
        }
    }
}
