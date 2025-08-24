import React, { useState } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Wallet, Coins, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAppStore } from "@/store/app"
import { getSigner, getContractWithSigner } from "../contract"
import { isValidEthereumAddress, formatAddress } from "@/lib/utils"

const mintSchema = z.object({
  recipient: z
    .string()
    .min(1, "Recipient address is required")
    .refine(isValidEthereumAddress, "Invalid Ethereum address format"),
})

type MintFormData = z.infer<typeof mintSchema>

export default function Mint() {
  const [isLoading, setIsLoading] = useState(false)
  const [txHash, setTxHash] = useState<string>("")
  const { toast } = useToast()
  const { setLoading } = useAppStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<MintFormData>({
    resolver: zodResolver(mintSchema),
    mode: "onChange",
  })

  const recipient = watch("recipient")

  const onSubmit = async (data: MintFormData) => {
    try {
      setIsLoading(true)
      setLoading("mint", true)
      
      toast({
        type: "info",
        title: "Connecting to wallet...",
        message: "Please approve the connection in your wallet",
      })

      const signer = await getSigner()
      const contract = getContractWithSigner(signer)
      
      toast({
        type: "info",
        title: "Sending transaction...",
        message: "Please confirm the mint transaction in your wallet",
      })

      const tx = await contract.mintCertificate(data.recipient)
      setTxHash(tx.hash)
      
      toast({
        type: "info",
        title: "Transaction submitted",
        message: `Waiting for confirmation... Hash: ${formatAddress(tx.hash)}`,
      })

      await tx.wait()
      
      toast({
        type: "success",
        title: "Certificate minted successfully!",
        message: `Certificate has been minted to ${formatAddress(data.recipient)}`,
        action: {
          label: "View Transaction",
          onClick: () => window.open(`https://etherscan.io/tx/${tx.hash}`, '_blank'),
        },
      })

      reset()
      setTxHash("")
    } catch (error: any) {
      console.error("Mint error:", error)
      
      let errorMessage = "Failed to mint certificate"
      if (error.code === 4001) {
        errorMessage = "Transaction was rejected by user"
      } else if (error.message?.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for transaction"
      } else if (error.message?.includes("user rejected")) {
        errorMessage = "Transaction was rejected"
      }

      toast({
        type: "error",
        title: "Mint failed",
        message: errorMessage,
      })
    } finally {
      setIsLoading(false)
      setLoading("mint", false)
    }
  }

  const handleClear = () => {
    reset()
    setTxHash("")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
            <Coins className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mint Certificate</h1>
            <p className="text-muted-foreground">
              Create a new certificate and mint it to a recipient's address
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Mint Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wallet className="h-5 w-5" />
                <span>Mint New Certificate</span>
              </CardTitle>
              <CardDescription>
                Owner/minter only. Mints an ERC721 certificate to the specified recipient.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="recipient" className="text-sm font-medium">
                    Recipient Address
                  </label>
                  <Input
                    id="recipient"
                    {...register("recipient")}
                    placeholder="0x..."
                    leftIcon={<Wallet className="h-4 w-4" />}
                    error={!!errors.recipient}
                    className="font-mono"
                  />
                  {errors.recipient && (
                    <p className="text-sm text-destructive flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.recipient.message}</span>
                    </p>
                  )}
                  {recipient && !errors.recipient && (
                    <p className="text-sm text-green-600 flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4" />
                      <span>Valid address format</span>
                    </p>
                  )}
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClear}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Clear
                  </Button>
                  <Button
                    type="submit"
                    disabled={!isValid || isLoading}
                    loading={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? "Minting..." : "Mint Certificate"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Transaction Status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Transaction Status</CardTitle>
              <CardDescription>
                Monitor your mint transaction progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              {txHash ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-800 dark:text-green-200">
                        Transaction Confirmed
                      </span>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                      Certificate has been successfully minted to the recipient.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Transaction Hash</label>
                    <div className="flex items-center space-x-2">
                      <Input
                        value={txHash}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(txHash)}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(`https://etherscan.io/tx/${txHash}`, '_blank')}
                  >
                    View on Etherscan
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Coins className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No transaction yet. Fill out the form and mint a certificate to see transaction details here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 