import Foundation
import Combine

enum TimerMode: String, CaseIterable {
    case focus = "专注"
    case shortBreak = "短休息"
    case longBreak = "长休息"

    var duration: TimeInterval {
        switch self {
        case .focus: return 25 * 60
        case .shortBreak: return 5 * 60
        case .longBreak: return 15 * 60
        }
    }

    var color: String {
        switch self {
        case .focus: return "FocusColor"
        case .shortBreak: return "ShortBreakColor"
        case .longBreak: return "LongBreakColor"
        }
    }
}

class TimerModel: ObservableObject {
    @Published var mode: TimerMode = .focus
    @Published var timeRemaining: TimeInterval = TimerMode.focus.duration
    @Published var isRunning = false
    @Published var completedPomodoros = 0
    @Published var progress: Double = 1.0

    private var timer: AnyCancellable?

    var formattedTime: String {
        let minutes = Int(timeRemaining) / 60
        let seconds = Int(timeRemaining) % 60
        return String(format: "%02d:%02d", minutes, seconds)
    }

    func toggle() {
        isRunning ? pause() : start()
    }

    func start() {
        isRunning = true
        timer = Timer.publish(every: 1, on: .main, in: .common)
            .autoconnect()
            .sink { [weak self] _ in
                self?.tick()
            }
    }

    func pause() {
        isRunning = false
        timer?.cancel()
        timer = nil
    }

    func reset() {
        pause()
        timeRemaining = mode.duration
        progress = 1.0
    }

    func switchMode(_ newMode: TimerMode) {
        pause()
        mode = newMode
        timeRemaining = newMode.duration
        progress = 1.0
    }

    private func tick() {
        guard timeRemaining > 0 else {
            complete()
            return
        }
        timeRemaining -= 1
        progress = timeRemaining / mode.duration
    }

    private func complete() {
        pause()
        if mode == .focus {
            completedPomodoros += 1
        }
        // Auto-advance to break
        if mode == .focus {
            switchMode(completedPomodoros % 4 == 0 ? .longBreak : .shortBreak)
        } else {
            switchMode(.focus)
        }
    }
}
