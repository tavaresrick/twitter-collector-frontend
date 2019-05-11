node() {
    def image = ''
    
    stage('Pull') {
        sh 'echo "Cleaning WorkDir"'
        cleanWs()
        sh 'echo "Fetching repo"'
        git credentialsId: 'Github', url: 'https://github.com/tavaresrick/twitter-collector-frontend'
    }
    stage('Build docker image') {
        sh 'echo "Building docker image"'
        image = docker.build("tavaresrick/twitter-collector-frontend:1.${env.BUILD_ID}")
        image.tag("latest")
    }
    stage('Unit test') {
        sh 'echo "Performing unit testing"'
        withEnv(["BACKEND_URL=http://localhost:8765"]) {
            sh "docker run -d --name tc_build_test_front -eBACKEND_URL=${BACKEND_URL} tavaresrick/twitter-collector-frontend:1.${env.BUILD_ID}"
        }
        sh 'sleep 10'
        sh 'docker exec tc_build_test_front  curl -f http://localhost/index.html'
        sh 'docker stop tc_build_test_front'
        sh 'docker rm tc_build_test_front'
    }
    stage('Push image') {
        sh 'echo "Pushing docker image to registry"'
        withCredentials([usernamePassword(credentialsId: 'Dockerhub', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
          sh "sudo docker login -u $USERNAME -p '$PASSWORD'"
          image.push()
          image.push('latest')
        }
    }
    stage('Deploy') {
        withCredentials([sshUserPrivateKey(credentialsId: 'SSHKeyDockerManager', keyFileVariable: 'KEYFILE', passphraseVariable: '', usernameVariable: 'USER')]) {
            def remote = [:]
            remote.name = 'manager'
            remote.host = '172.31.41.11'
            remote.user = USER
            remote.identityFile = KEYFILE
            remote.allowAnyHosts = true
            sshCommand remote: remote, sudo: true, command: "docker service update --image tavaresrick/twitter-collector-frontend:1.${env.BUILD_ID} frontend_frontend"
        }
    }
}