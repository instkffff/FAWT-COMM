// "function-1m": "x = (y + 0.267749) / 0.0574675",
// "function-3m": "x = (y + 1.45823) / 0.0368961"

// 测量结果是等比消散 所以其余距离风力pwm对应为 线性插值法 估算

function calculateX(y, m) {
    // 限制 y 的范围在 0~13
    y = Math.max(0, Math.min(13, y));

    // 限制 m 的范围在 1~3
    m = Math.max(1, Math.min(3, m));

    const numerator = y + (0.5952405 * m - 0.3274915);
    const denominator = 0.0677532 - 0.0102857 * m;

    if (denominator === 0) {
        throw new Error("分母不能为零，请检查 m 的取值");
    }

    const x = numerator / denominator;

    // 对 x 限制在 50~250 之间
    const clampedX = Math.max(50, Math.min(250, Math.round(x)));

    return clampedX;
}

export { calculateX };