import SwiftUI

struct ContentView: View {
    @StateObject private var model = TimerModel()

    var body: some View {
        ZStack {
            BackgroundView(mode: model.mode)
            VStack(spacing: 0) {
                HeaderView(completedPomodoros: model.completedPomodoros)
                Spacer()
                ModeSelectorView(model: model)
                    .padding(.bottom, 40)
                TimerRingView(model: model)
                Spacer()
                ControlsView(model: model)
                    .padding(.bottom, 48)
            }
        }
        .ignoresSafeArea()
    }
}

// MARK: - Background

struct BackgroundView: View {
    let mode: TimerMode

    var gradient: LinearGradient {
        switch mode {
        case .focus:
            return LinearGradient(
                colors: [Color(hex: "1a1a2e"), Color(hex: "16213e"), Color(hex: "0f3460")],
                startPoint: .topLeading, endPoint: .bottomTrailing
            )
        case .shortBreak:
            return LinearGradient(
                colors: [Color(hex: "0d2137"), Color(hex: "0a3d2b"), Color(hex: "0d4f38")],
                startPoint: .topLeading, endPoint: .bottomTrailing
            )
        case .longBreak:
            return LinearGradient(
                colors: [Color(hex: "1a0a2e"), Color(hex: "2d1b4e"), Color(hex: "1a0a2e")],
                startPoint: .topLeading, endPoint: .bottomTrailing
            )
        }
    }

    var body: some View {
        gradient
            .animation(.easeInOut(duration: 0.6), value: mode)
    }
}

// MARK: - Header

struct HeaderView: View {
    let completedPomodoros: Int

    var body: some View {
        VStack(spacing: 6) {
            Text("番茄钟")
                .font(.system(size: 22, weight: .bold, design: .rounded))
                .foregroundColor(.white)
            HStack(spacing: 6) {
                ForEach(0..<4, id: \.self) { i in
                    Circle()
                        .fill(i < (completedPomodoros % 4) ? Color(hex: "e74c3c") : Color.white.opacity(0.2))
                        .frame(width: 10, height: 10)
                        .scaleEffect(i < (completedPomodoros % 4) ? 1.1 : 1.0)
                        .animation(.spring(response: 0.3), value: completedPomodoros)
                }
                if completedPomodoros > 0 {
                    Text("×\(completedPomodoros / 4 > 0 ? "\(completedPomodoros / 4)" : "")")
                        .font(.system(size: 11, weight: .medium))
                        .foregroundColor(.white.opacity(0.5))
                }
            }
        }
        .padding(.top, 64)
    }
}

// MARK: - Mode Selector

struct ModeSelectorView: View {
    @ObservedObject var model: TimerModel

    var body: some View {
        HStack(spacing: 4) {
            ForEach(TimerMode.allCases, id: \.self) { mode in
                Button(action: { model.switchMode(mode) }) {
                    Text(mode.rawValue)
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(model.mode == mode ? .white : .white.opacity(0.45))
                        .padding(.horizontal, 16)
                        .padding(.vertical, 8)
                        .background(
                            Capsule()
                                .fill(model.mode == mode ? Color.white.opacity(0.18) : Color.clear)
                        )
                }
                .buttonStyle(.plain)
                .animation(.spring(response: 0.3), value: model.mode)
            }
        }
        .padding(4)
        .background(
            Capsule()
                .fill(Color.white.opacity(0.08))
        )
    }
}

// MARK: - Timer Ring

struct TimerRingView: View {
    @ObservedObject var model: TimerModel
    @State private var pulse = false

    var accentColor: Color {
        switch model.mode {
        case .focus: return Color(hex: "e74c3c")
        case .shortBreak: return Color(hex: "2ecc71")
        case .longBreak: return Color(hex: "9b59b6")
        }
    }

    var body: some View {
        ZStack {
            // Outer glow ring
            Circle()
                .stroke(accentColor.opacity(0.08), lineWidth: 28)
                .frame(width: 280, height: 280)

            // Track ring
            Circle()
                .stroke(Color.white.opacity(0.08), lineWidth: 12)
                .frame(width: 250, height: 250)

            // Progress ring
            Circle()
                .trim(from: 0, to: model.progress)
                .stroke(
                    AngularGradient(
                        gradient: Gradient(colors: [accentColor.opacity(0.6), accentColor]),
                        center: .center,
                        startAngle: .degrees(-90),
                        endAngle: .degrees(270)
                    ),
                    style: StrokeStyle(lineWidth: 12, lineCap: .round)
                )
                .frame(width: 250, height: 250)
                .rotationEffect(.degrees(-90))
                .animation(.linear(duration: 1), value: model.progress)

            // Progress cap dot
            Circle()
                .fill(accentColor)
                .frame(width: 14, height: 14)
                .offset(y: -125)
                .rotationEffect(.degrees(360 * (1 - model.progress) * -1 - 90 + 360 * (1 - model.progress)))
                .animation(.linear(duration: 1), value: model.progress)

            // Center content
            VStack(spacing: 8) {
                Text(model.formattedTime)
                    .font(.system(size: 64, weight: .thin, design: .monospaced))
                    .foregroundColor(.white)
                    .contentTransition(.numericText())

                Text(model.mode.rawValue)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(.white.opacity(0.5))
                    .textCase(.uppercase)
                    .tracking(2)
            }
        }
        .scaleEffect(pulse && model.isRunning ? 1.01 : 1.0)
        .onAppear {
            withAnimation(.easeInOut(duration: 2).repeatForever(autoreverses: true)) {
                pulse = true
            }
        }
    }
}

// MARK: - Controls

struct ControlsView: View {
    @ObservedObject var model: TimerModel

    var accentColor: Color {
        switch model.mode {
        case .focus: return Color(hex: "e74c3c")
        case .shortBreak: return Color(hex: "2ecc71")
        case .longBreak: return Color(hex: "9b59b6")
        }
    }

    var body: some View {
        HStack(spacing: 32) {
            // Reset button
            Button(action: model.reset) {
                ZStack {
                    Circle()
                        .fill(Color.white.opacity(0.1))
                        .frame(width: 56, height: 56)
                    Image(systemName: "arrow.counterclockwise")
                        .font(.system(size: 20, weight: .medium))
                        .foregroundColor(.white.opacity(0.7))
                }
            }
            .buttonStyle(.plain)

            // Play/Pause button
            Button(action: model.toggle) {
                ZStack {
                    Circle()
                        .fill(accentColor)
                        .frame(width: 80, height: 80)
                        .shadow(color: accentColor.opacity(0.5), radius: 16, x: 0, y: 4)
                    Image(systemName: model.isRunning ? "pause.fill" : "play.fill")
                        .font(.system(size: 26, weight: .bold))
                        .foregroundColor(.white)
                        .offset(x: model.isRunning ? 0 : 2)
                        .contentTransition(.symbolEffect(.replace))
                }
            }
            .buttonStyle(.plain)
            .animation(.spring(response: 0.3), value: model.isRunning)

            // Skip button
            Button(action: { model.switchMode(nextMode) }) {
                ZStack {
                    Circle()
                        .fill(Color.white.opacity(0.1))
                        .frame(width: 56, height: 56)
                    Image(systemName: "forward.end.fill")
                        .font(.system(size: 20, weight: .medium))
                        .foregroundColor(.white.opacity(0.7))
                }
            }
            .buttonStyle(.plain)
        }
    }

    var nextMode: TimerMode {
        switch model.mode {
        case .focus: return model.completedPomodoros % 4 == 3 ? .longBreak : .shortBreak
        case .shortBreak, .longBreak: return .focus
        }
    }
}

// MARK: - Color Extension

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let r = Double((int >> 16) & 0xFF) / 255
        let g = Double((int >> 8) & 0xFF) / 255
        let b = Double(int & 0xFF) / 255
        self.init(red: r, green: g, blue: b)
    }
}

#Preview {
    ContentView()
}
