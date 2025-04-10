"use client"
import type { BookingType } from "@/app/types/service"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, ClockIcon, UserCircle } from "lucide-react"
import Link from "next/link"
import React, { useActionState, useEffect } from "react"
import { isBefore, isAfter } from "date-fns"
import { cancleBooking } from "@/app/actions"
import { toast } from "sonner"
import { SubmitButton } from "@/components/global/SubmitButton"

export const BookingCard = ({ booking }: { booking: BookingType }) => {
  const initialState = { message: "", status: undefined, errors: {} }
  const [state, formAction] = useActionState(cancleBooking, initialState)

  useEffect(() => {
    if (state?.status === "success") {
      toast.success(state.message)
    } else if (state?.status === "error") {
      toast.error(state.message)
      console.log(state.errors)
    }
  }, [state])

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getBookingStatus = (booking: BookingType): string => {
    const now = new Date()
    const startTime = new Date(booking.AvailableSlot?.startTime as any)
    const endTime = new Date(booking.AvailableSlot?.endTime as any)

    if (isBefore(now, startTime)) {
      return "Upcoming"
    } else if (isAfter(now, endTime)) {
      return "Completed"
    } else {
      return "Live"
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{booking.Service?.title || "Untitled Service"}</h2>
          <Badge variant={getBookingStatus(booking) === "Live" ? "default" : "secondary"}>
            {getBookingStatus(booking)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Information */}
        {booking.User && (
          <div className="flex items-center space-x-4 p-4 bg-secondary rounded-lg">
            <Avatar>
              <AvatarImage src={booking.User.image as string || ""} />
              <AvatarFallback>
                <UserCircle className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{booking.User.name || "Anonymous User"}</p>
              <p className="text-sm text-muted-foreground">{booking.User.email}</p>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Service Type</p>
            <p className="font-medium">{booking.bookingType}</p>
          </div>
          {booking.Service && (
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="font-medium">₹{booking.Service.price.toFixed(2)}</p>
            </div>
          )}
        </div>
        {booking.AvailableSlot && (
          <>
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <p>{formatDate(booking.AvailableSlot.startTime)}</p>
            </div>
            <div className="flex items-center">
              <ClockIcon className="mr-2 h-4 w-4" />
              <p>
                {formatTime(booking.AvailableSlot.startTime)} - {formatTime(booking.AvailableSlot.endTime)}
              </p>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <form action={formAction}>
          <input type="hidden" name="bookingId" value={booking.id} />
          <input type="hidden" name="serviceId" value={booking.serviceId} />
          <input type="hidden" name="slotId" value={booking.availableSlotId} />
          <SubmitButton text="Cancel" variant={"outline"} />
        </form>
        <Button asChild disabled={getBookingStatus(booking) === "Completed"}>
          <Link href={`/tutor/bookings/${booking.id}`}>Join Now</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

