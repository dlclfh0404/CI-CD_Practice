#include <stdio.h>

int main() {
    int dan;

    printf("출력할 단을 입력하세요: ");
    scanf("%d", &dan);

    if (dan < 1 || dan > 9) {
        printf("1에서 9 사이의 숫자만 입력하세요.\n");
        return 1;
    }

    printf("=== %d단 ===\n", dan);
    for (int i = 1; i <= 9; i++) {
        printf("%d x %d = %d\n", dan, i, dan * i);
    }

    return 0;
}

