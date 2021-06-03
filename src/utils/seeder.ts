import axios from "axios";

/**
 * Seeding services if first start
 */

export const startSeed = async () => {
  try {
    const { data: services } = await axios.get<{
      count: number;
      services: any[];
    }>(`http://${process.env.IOT_AGENT_URL}/iot/services`, {
      headers: {
        "fiware-service": "openiot",
        "fiware-servicepath": "/",
      },
    });

    if (services.count === 0) {
      await axios.post(
        `http://${process.env.IOT_AGENT_URL}/iot/services`,
        {
          services: [
            {
              apikey: "bGFtcHVtYW50YXBtYW50YXA",
              cbroker: "http://orion:1027",
              entity_type: "Lamp",
              resource: "/iot/d",
            },
            {
              apikey: "a3VuY2ltYW50YXBtYW50YXA",
              cbroker: "http://orion:1027",
              entity_type: "Lock",
              resource: "/iot/d",
            },
            {
              apikey: "c2Vuc29ybWFudGFwbWFudGFw",
              cbroker: "http://orion:1027",
              entity_type: "Temperature",
              resource: "/iot/d",
            },
          ],
        },
        {
          headers: {
            "fiware-service": "openiot",
            "fiware-servicepath": "/",
            "Content-Type": "application/json",
          },
        }
      );

      return;
    }
  } catch (error) {
    return console.error("failed:", error);
  }
};
