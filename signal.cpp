//
// Created by sunhengke on 4/20/20.
//

#include <unistd.h>
#include <wait.h>
#include <iostream>

using namespace std;

void func(int signum) {
    cout<<getpid()<<endl;
    printf("It is signal processing function, current signal number is %d. \n", signum);
}

int main() {
    int status;
    pid_t pid;
    cout<<getpid()<<endl;
    signal(SIGUSR1, func);        /* 预置信号处理程序 */
    pid = fork();
    if(pid<0) exit(-1);
    if (pid==0) {
        pause();
        printf("Child：signal is received.\n");
        cout<<getpid()<<endl;
        exit(0);
    }
    if(pid>0){
        printf("Parent: will send signal.\n");
        sleep(1);
        kill(pid, SIGUSR1);    /* 发送信号 */
        wait(&status);         /* 等待子进程停止 */
        printf("status=%d: Parent finished:\n", status);
    }
    return 0;
}