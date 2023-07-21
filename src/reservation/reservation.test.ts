import { HttpStatus } from "@nestjs/common";
import { ReservationService } from "./reservation.service";
import { CreateReservationDto } from "./dto/create-reservation.dto";

const reservationService = new ReservationService();

describe("Reservations module", () => {
  test("The reservation registers", async () => {
    const newReservation = new CreateReservationDto();
    newReservation.date = "20-07-2023";
    newReservation.paid = false;
    newReservation.client = "Ostir Amozosa";
    newReservation.reservedBy = "Juan Alberto Ortigoza";

    const [status, reservation] = await reservationService.create(newReservation);
    expect(status).toBe(HttpStatus.CREATED);
    expect(reservation).not.toBe(null);
  });

  test("Fetch all reservations", async () => {
    const [status, reservations] = await reservationService.findAll();

    expect(status).toBe(HttpStatus.OK);
    expect(reservations.length).toBeGreaterThan(0);
  });

  test("Delete reservation", async () => {
    const status = await reservationService.remove("20-07-2023");

    expect(status).toBe(HttpStatus.OK);
  });
});
