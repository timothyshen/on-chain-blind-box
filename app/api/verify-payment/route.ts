import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

// Mock data for purchased items - in a real app, this would be in a database
const COIN_PACKAGES = {
  starter: { coins: 100, bonus: 0 },
  popular: { coins: 250, bonus: 50 },
  premium: { coins: 550, bonus: 150 },
  collector: { coins: 1200, bonus: 400 },
}

const BLIND_BOX_PACKAGES = {
  single_mystery: { pullCount: 1 },
  triple_pack: { pullCount: 3 },
  magic_guarantee: { pullCount: 3, guaranteedCollection: "magic" },
  fantasy_deluxe: { pullCount: 5, guaranteedCollection: "fantasy" },
  space_legendary: { pullCount: 3, guaranteedCollection: "space" },
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, productId, productType } = await request.json()

    // Verify the payment session
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
    }

    let response = {}

    if (productType === "coins") {
      const coinPackage = COIN_PACKAGES[productId as keyof typeof COIN_PACKAGES]
      if (coinPackage) {
        response = {
          success: true,
          coinsReceived: coinPackage.coins + coinPackage.bonus,
          type: "coins",
        }
      }
    } else if (productType === "boxes") {
      const boxPackage = BLIND_BOX_PACKAGES[productId as keyof typeof BLIND_BOX_PACKAGES]
      if (boxPackage) {
        // Generate the items for the blind boxes
        const items = generateBlindBoxItems(boxPackage.pullCount, boxPackage.guaranteedCollection)
        response = {
          success: true,
          itemsReceived: items,
          type: "boxes",
        }
      }
    }

    return NextResponse.json(response)
  } catch (err: any) {
    console.error("Payment verification error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// Helper function to generate blind box items
function generateBlindBoxItems(count: number, guaranteedCollection?: string) {
  const collections = ["toys", "magic", "fantasy", "tech", "nature", "space"]
  const items = []

  // Add guaranteed item first if specified
  if (guaranteedCollection) {
    items.push(generateRandomItem(guaranteedCollection))
    count--
  }

  // Add remaining random items
  for (let i = 0; i < count; i++) {
    const randomCollection = collections[Math.floor(Math.random() * collections.length)]
    items.push(generateRandomItem(randomCollection))
  }

  return items
}

function generateRandomItem(collection: string) {
  // This is a simplified version - you'd want to use your actual item generation logic
  const itemIds = {
    toys: ["1", "2", "3"],
    magic: ["4", "5", "6"],
    fantasy: ["7", "8", "9", "10"],
    tech: ["11", "12"],
    nature: ["13", "14"],
    space: ["15", "16"],
  }

  const ids = itemIds[collection as keyof typeof itemIds] || ["1"]
  const randomId = ids[Math.floor(Math.random() * ids.length)]
  const version = Math.random() < 0.2 ? "hidden" : "standard"

  // Return a mock item - in a real app, fetch from your items database
  return {
    id: randomId + (version === "hidden" ? "h" : ""),
    collection,
    version,
    // ... other item properties
  }
}
