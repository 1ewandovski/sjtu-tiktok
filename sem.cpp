//
// Created by sunhengke on 4/21/20.
//

#include <sys/sem.h>
#include <sys/shm.h>
#include <unistd.h>
#include <iostream>

using namespace std;

int creatsem(key_t key) {
    int sid;
    union semun {   /* 如sem.h中已定义,则省略 */
        int val;
        struct semid_ds *buf;
        ushort *array;
    } arg{};
    if ((sid = semget(key, 1, 0666 | IPC_CREAT)) == -1)
        cout << "semget wrong\n";
    arg.val = 1;
    if (semctl(sid, 0, SETVAL, arg) == -1)
        cout << "semctl wrong.\n";
    return (sid);
}

static void semcall(int sid, short op) {
    auto sb = new sembuf{.sem_num = 0, .sem_op=op, .sem_flg=0};
    if (semop(sid, sb, 1) == -1)
        cout << "semop wrong.\n";
};

void P(int sid) {
    semcall(sid, -1);
}

void V(int sid) {
    semcall(sid, 1);
}


#define SHMKEY 18001       /* 共享内存关键字 */
#define SIZE 1024             /* 共享内存长度 */
#define SEMKEY1 19001   /* 信号灯组1关键字 */
#define SEMKEY2 19002  /* 信号灯组2关键字 */

int main() {
    char *segaddr;
    int segid, sid1, sid2;
    /* 创建共享内存段 */
    if ((segid = shmget(SHMKEY, SIZE, IPC_CREAT | 0666)) == -1)
        cout << "shmget wrong.\n";
    /* 将共享内存映射到进程数据空间 */
    segaddr = (char *) shmat(segid, nullptr, 0);
    sid1 = creatsem(SEMKEY1); /* 创建两个信号灯,初值为1 */
    sid2 = creatsem(SEMKEY2);
    P(sid2);                /* 置信号灯2值为0,表示缓冲区空 */

    if (!fork())
        while (1) {           /* 子进程,接收和输出 */
            P(sid2);
            printf("Received from Parent: %s\n", segaddr);
            V(sid1);
        }

    while (1) {              /* 父进程,输入和存储 */
        P(sid1);
        scanf("%s", segaddr);
        V(sid2);
    }
}