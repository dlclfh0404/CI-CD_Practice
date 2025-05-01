#include <stdio.h>

int main() {
    int year;

    // 사용자로부터 연도 입력 받기
    printf("연도를 입력하세요: ");
    scanf("%d", &year);

    // 윤년 조건 판별
    if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
        printf("%d년은 윤년입니다.\n", year);
    } else {
        printf("%d년은 윤년이 아닙니다.\n", year);
    }

    return 0;
}

