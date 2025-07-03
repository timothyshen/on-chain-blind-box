"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { GameResult } from "../hooks/use-game-state"

interface GameResultModalProps {
  result: GameResult
  coins: number
  onPlayAgain: () => void
  onDismiss: () => void
}

export function GameResultModal({ result, coins, onPlayAgain, onDismiss }: GameResultModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="bg-white border-4 border-purple-500 shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-300">
        <CardContent className="p-8 text-center">
          {result.won ? (
            <div className="space-y-4">
              <div className="text-6xl animate-bounce">{result.prize?.emoji}</div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-green-600">🎉 WINNER! 🎉</h2>
                <p className="text-xl font-semibold text-gray-800">You won a {result.prize?.name}!</p>
                <p className="text-lg text-purple-600">+100 Points!</p>
              </div>
              <div className="bg-green-100 border-2 border-green-300 rounded-lg p-4">
                <p className="text-green-800 font-medium">{result.message}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-6xl animate-pulse">😔</div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-red-600">Better Luck Next Time!</h2>
                <p className="text-lg text-gray-600">The prize slipped away...</p>
              </div>
              <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4">
                <p className="text-red-800 font-medium">{result.message}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 mt-6">
            {coins > 0 ? (
              <Button
                onClick={onPlayAgain}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 text-lg"
              >
                🎮 Play Again (1 Coin)
              </Button>
            ) : (
              <div className="bg-yellow-100 border-2 border-yellow-300 rounded-lg p-3">
                <p className="text-yellow-800 font-medium">No coins left! Add more coins to play again.</p>
              </div>
            )}

            <Button
              onClick={onDismiss}
              variant="outline"
              className="w-full border-gray-400 text-gray-600 hover:bg-gray-100"
            >
              Close
            </Button>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            <p>Coins remaining: {coins}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
