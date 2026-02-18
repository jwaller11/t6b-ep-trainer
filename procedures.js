export const procedures = [

  /* =====================================================
     ABORT START PROCEDURE
     1 NOTE BULLET → A1, A2, A3
  ===================================================== */
  {
    id: "abort_start",
    title: "ABORT START PROCEDURE",
    steps: [

      {
        type: "action",
        text: "PCL - OFF or STARTER switch - AUTO/RESET"
      },

      {
        type: "noteGroup",
        bullets: [
          [
            "If start is initiated with PCL in the OFF position, abort by reselecting AUTO/RESET on the STARTER switch.",
            "If start is initiated with PCL out of the OFF position, but not past the IDLE gate, abort by placing the PCL to OFF or reselecting AUTO/RESET on the STARTER switch.",
            "If the PCL is past the IDLE gate, abort by placing the PCL to OFF."
          ]
        ]
      }

    ]
  },

  /* =====================================================
     EMERGENCY ENGINE SHUTDOWN ON THE GROUND
     NO NWCs
  ===================================================== */
  {
    id: "emergency_engine_shutdown_ground",
    title: "EMERGENCY ENGINE SHUTDOWN ON THE GROUND",
    steps: [

      {
        type: "action",
        text: "PCL - OFF"
      },
      {
        type: "action",
        text: "FIREWALL SHUTOFF HANDLE - PULL"
      },
      {
        type: "action",
        text: "EMERGENCY GROUND EGRESS - AS REQUIRED"
      }

    ]
  },

  /* =====================================================
     EMERGENCY GROUND EGRESS
     Mixed structure with grouped bullets
  ===================================================== */
  {
    id: "emergency_ground_egress",
    title: "EMERGENCY GROUND EGRESS",
    steps: [

      /* ---- NOTE (1 bullet) ---- */
      {
        type: "noteGroup",
        bullets: [
          [
            "In a situation requiring immediate ground egress, the ejection system has the capability for 0/0 ejection."
          ]
        ]
      },

      /* ---- ACTION 1 ---- */
      {
        type: "action",
        text: "ISS MODE SELECTOR - SOLO"
      },

      /* ---- WARNING under #1 (1 bullet) ---- */
      {
        type: "warningGroup",
        bullets: [
          [
            "Failure to ensure that the ISS mode selector is set to SOLO may result in the inadvertent ejection of one or both seats."
          ]
        ]
      },

      /* ---- ACTION 2 ---- */
      {
        type: "action",
        text: "SEAT SAFETY PIN - INSTALL (BOTH)"
      },

      /* ---- WARNING under #2 (1 bullet) ---- */
      {
        type: "warningGroup",
        bullets: [
          [
            "Failure to insert both ejection seat safety pins (if occupied) before ground egress may result in inadvertent activation of ejection sequence and subsequent injury or death when performing emergency ground egress."
          ]
        ]
      },

      /* ---- ACTION 3 & 4 ---- */
      {
        type: "action",
        text: "PARKING BRAKE - AS REQUIRED"
      },
      {
        type: "action",
        text: "CANOPY - OPEN"
      },

      /* ---- CONDITION HEADER ---- */
      {
        type: "condition",
        text: "IF CANOPY CANNOT BE OPENED OR SITUATION REQUIRES RIGHT SIDE EGRESS:"
      },

      /* ---- ACTION 5 & 6 ---- */
      {
        type: "action",
        text: "CFS HANDLE SAFETY PIN - REMOVE (BOTH)"
      },
      {
        type: "action",
        text: "CFS HANDLE - ROTATE 90 DEGREES COUNTERCLOCKWISE AND PULL (BOTH)"
      },

      /* ---- WARNINGS under #6 (3 bullets) ---- */
      {
  type: "warningGroup",
  bullets: [

    // Bullet A (wrapped into 2 lines)
    [
      "If the canopy fracturing system malfunctions in conjunction with a canopy latch failure in the locked position, ejection may be the only option remaining to exit the aircraft.",
      "Aircrew shall remove the ejection seat safety pin and ensure shoulder straps, lap straps, and leg restraint garters are still attached prior to pulling the ejection handle."
    ],

    // Bullet B (single line)
    [
      "To prevent injury, ensure oxygen mask is on and visor is down prior to actuating the CFS system."
    ],

    // Bullet C (wrapped into 2 lines)
    [
      "Each internal CFS handle activates only the CFS charge for the respective transparency.",
      "Both internal CFS handles must be activated in order to fracture both transparencies (if required)."
    ]

  ]
},

      /* ---- ACTION 7 ---- */
      {
        type: "action",
        text: "UPPER FITTINGS, LOWER FITTINGS, AND LEG RESTRAINT GARTERS - RELEASE (BOTH)"
      },

      /* ---- NOTE under #7 (1 bullet split into 2 lines) ---- */
      {
        type: "noteGroup",
        bullets: [
          [
            "Oxygen hose, emergency oxygen hose, communication leads, and anti-G suit hose will pull free while vacating cockpit.",
            "Leg restraint lines will pull through leg restraint garter D rings if released with quick-release lever."
          ]
        ]
      },

      /* ---- ACTION 8 ---- */
      {
        type: "action",
        text: "BAT, GEN, AND AUX BAT SWITCHES - OFF"
      }

    ]
  },
{
  id: "abort",
  title: "ABORT",
  steps: [

    { type: "action", text: "PCL - IDLE" },
    { type: "action", text: "BRAKES - AS REQUIRED" },

    {
      type: "warningGroup",
      bullets: [
        [
          "After a stop which required maximum effort braking and if overheated brakes are suspected, do not taxi into or park in a congested area until brakes have had sufficient time to cool.",
          "Do not set parking brake."
        ]
      ]
    }

  ]
},
{
  id: "engine_failure_takeoff",
  title: "ENGINE FAILURE IMMEDIATELY AFTER TAKEOFF (SUFFICIENT RUNWAY REMAINING STRAIGHT AHEAD)",
  steps: [

    {
      type: "warningGroup",
      bullets: [
        [
          "If insufficient runway remains to land straight ahead, consider immediate ejection."
        ],
        [
          "Do not sacrifice aircraft control while troubleshooting or lowering gear with the emergency system."
        ]
      ]
    },

    { type: "action", text: "AIRSPEED - 110 KNOTS (MINIMUM)" },
    { type: "action", text: "PCL - AS REQUIRED" },

    {
      type: "noteGroup",
      bullets: [
        [
          "The pilot should select IDLE to use the increased drag of the not yet feathered propeller or select OFF to reduce the sink rate."
        ]
      ]
    },

    { type: "action", text: "EMER LDG GR HANDLE - PULL (AS REQUIRED)" },

    {
      type: "noteGroup",
      bullets: [
        [
          "With a loss of hydraulic pressure, landing gear and flaps cannot be lowered by normal means."
        ]
      ]
    },

    { type: "action", text: "FLAPS - AS REQUIRED" }

  ]
},
{
  id: "engine_failure_flight",
  title: "ENGINE FAILURE DURING FLIGHT",
  steps: [

    {
      type: "noteGroup",
      bullets: [
        [
          "Zoom results with an engine still producing a usable torque (>6%) will be several hundred to several thousand feet higher in altitude gained."
        ],
        [
          "Each low altitude zoom capability chart depicted in Figure 3-2, Figure 3-3, and Figure 3-4 represents a no engine condition.",
          "Each chart assumes the pilot will not perform any action prior to actual engine failure."
        ],
        [
          "If experiencing uncommanded power changes/loss of power/uncommanded propeller feather or compressor stalls, refer to appropriate procedure."
        ]
      ]
    },

    { type: "action", text: "ZOOM/GLIDE - 125 KNOTS (MINIMUM)" },
    { type: "action", text: "PCL - OFF" },

    {
      type: "noteGroup",
      bullets: [
        [
          "Propeller will not feather unless the PCL is fully in OFF."
        ]
      ]
    },

    { type: "action", text: "INTERCEPT ELP" },

    {
      type: "warningGroup",
      bullets: [
        [
          "If a suitable landing surface is available, turn immediately to intercept the nearest suitable point on the ELP.",
          "Any delay could result in insufficient gliding distance to reach a landing surface."
        ],
        [
          "Do not delay decision to eject below 2000 feet AGL."
        ]
      ]
    },

    { type: "action", text: "AIRSTART - ATTEMPT IF WARRANTED" },

    {
      type: "warningGroup",
      bullets: [
        [
          "Airstart procedure is not recommended below 2000 feet AGL, as primary attention should be to eject or safely recover the aircraft."
        ]
      ]
    },

    {
      type: "noteGroup",
      bullets: [
        [
          "Crosscheck N1 against other engine indications to assess condition of engine and determine if an airstart is warranted.",
          "At 125 KIAS, an engine which has flamed out will rotate below 8% N1 and indicate 0% N1.",
          "The engine oil pressure indicator may display oil pressures up to 4 psi with or without the engine seized."
        ]
      ]
    },

    {
      type: "condition",
      text: "IF CONDITIONS DO NOT WARRANT AN AIRSTART:"
    },

    { type: "action", text: "FIREWALL SHUTOFF HANDLE - PULL" },
    { type: "action", text: "EXECUTE FORCED LANDING OR EJECT" }

  ]
},
{
  id: "immediate_airstart_pmu_norm",
  title: "IMMEDIATE AIRSTART (PMU NORM)",
  steps: [

    {
      type: "warningGroup",
      bullets: [
        [
          "Consideration should be given to not attempting an airstart if on a minimum glide profile to an airfield, since repeated airstart attempts will result in excessive altitude loss."
        ],
        [
          "Airstart attempts outside of the airstart envelope may be unsuccessful or result in engine overtemperature.",
          "Consideration should be given to ensure airstarts are attempted within the airstart envelope (125-200 KIAS for sea level to 15,000 feet, or 135-200 KIAS for 15,001 to 20,000 feet)."
        ]
      ]
    },

    { type: "action", text: "PCL - OFF" },

    {
      type: "warningGroup",
      bullets: [
        [
          "Do not delay ejection while attempting airstart at low altitude if below 2000 feet AGL."
        ],
        [
          "PCL must be in OFF to feather the propeller, and ensure proper starter, ignition, boost pump, and PMU operation during airstart."
        ]
      ]
    },

    {
      type: "cautionGroup",
      bullets: [
        [
          "Ensure PCL is in OFF; otherwise, fuel may be prematurely introduced during start"
        ]
      ]
    },

    { type: "action", text: "STARTER SWITCH - AUTO/RESET" },

    {
      type: "cautionGroup",
      bullets: [
        [
          "If N1 does not rise within 5 seconds, discontinue the airstart attempt and proceed to IF AIRSTART IS UNSUCCESSFUL due to suspected mechanical failure."
        ]
      ]
    },

    { type: "action", text: "PCL - IDLE, ABOVE 13% N1" },

    {
      type: "warningGroup",
      bullets: [
        [
          "Movement of the PCL above IDLE before N1 stabilizes at approximately 67% will cause an increase in fuel flow which may cause engine failure due to a severe ITT overtemperature."
        ]
      ]
    },

    {
      type: "cautionGroup",
      bullets: [
        [
          "If there is no rise in ITT within 10 seconds after fuel flow indications, place the PCL to OFF and abort the start."
        ]
      ]
    },

    { type: "action", text: "ENGINE INSTRUMENTS - MONITOR ITT, N1, AND OIL PRESSURE" },

    {
      type: "condition",
      text: "IF AIRSTART IS UNSUCCESSFUL:"
    },

    { type: "action", text: "PCL - OFF" },
    { type: "action", text: "FIREWALL SHUTOFF HANDLE - PULL" },
    { type: "action", text: "EXECUTE FORCED LANDING OR EJECT" },

    {
      type: "condition",
      text: "IF AIRSTART IS SUCCESSFUL:"
    },

    { type: "action", text: "PCL - AS REQUIRED AFTER N1 REACHES IDLE RPM (APPROXIMATELY 67% N1)" },
    { type: "action", text: "PEL - EXECUTE" }

  ]
},
{
  id: "uncommanded_power_changes",
  title: "UNCOMMANDED POWER CHANGES / LOSS OF POWER / UNCOMMANDED PROPELLER FEATHER",
  steps: [

    { type: "action", text: "PCL - MID RANGE" },

    {
      type: "noteGroup",
      bullets: [
        [
          "Mid range is a physical PCL angle that approximates the midway position between IDLE and MAX."
        ],
        [
          "A PCL position above IDLE will provide the best chance for the engine to recover."
        ],
        [
          "A mid-range PCL position will minimize the potential of engine overtorque and/or overtemperature when the PMU is turned OFF."
        ]
      ]
    },

    { type: "action", text: "PMU SWITCH - OFF" },

    {
      type: "cautionGroup",
      bullets: [
        [
          "There is a potential for ITT limits to be exceeded if the PMU switch is turned OFF with ITT ≥820 °C."
        ],
        [
          "Ground idle will not be available during landing rollout and taxi.",
          "Plan for increased landing distances due to higher IDLE N1 (approximately 67%)."
        ]
      ]
    },

    { type: "action", text: "PROP SYS CIRCUIT BREAKER (Left Front Console) - PULL, IF Np STABLE BELOW 40%" },

    {
      type: "noteGroup",
      bullets: [
        [
          "With constant airspeed and torque, RPM can be considered stable if below 40% and no upward change for a 3-second period."
        ],
        [
          "If NP indicator is displaying red X’s, switching the PMU to NORM and back OFF will reset the PMU and should restore the NP indication."
        ],
        [
          "Propeller should come out of feather within 15-20 seconds."
        ]
      ]
    },

    { type: "action", text: "PCL - AS REQUIRED" },

    {
      type: "warningGroup",
      bullets: [
        [
          "If rate of descent (indicated on the VSI while stabilized at 125 KIAS with gear, flaps, and speed brake retracted and 4-6% torque) is greater than 1500 ft/min, increase torque as necessary (up to 131%) to achieve approximately 1350-1500 ft/min rate of descent.",
          "If engine power is insufficient to produce a rate of descent less than 1500 ft/min, set PCL to OFF."
        ]
      ]
    },

    {
      type: "noteGroup",
      bullets: [
        [
          "The pilot should consider moving the PCL through the full range of motion to determine power available."
        ]
      ]
    },

    {
      type: "condition",
      text: "IF POWER IS SUFFICIENT FOR CONTINUED FLIGHT:"
    },

    { type: "action", text: "PEL - EXECUTE" },

    {
      type: "condition",
      text: "IF POWER IS INSUFFICIENT TO COMPLETE PEL:"
    },

    {
      type: "cautionGroup",
      bullets: [
        [
          "Consideration should be given to leaving the engine operating with PCL at mid range."
        ]
      ]
    },

    { type: "action", text: "PROP SYS CIRCUIT BREAKER - RESET, AS REQUIRED" },

    {
      type: "warningGroup",
      bullets: [
        [
          "With the PROP SYS circuit breaker pulled and the PMU switch OFF, the feather dump solenoid will not be powered.",
          "The propeller will feather at a slower rate as oil pressure decreases and the feathering spring takes effect.",
          "Glide performance will be considerably reduced and it may not be possible to intercept or fly the emergency landing pattern."
        ]
      ]
    },

    { type: "action", text: "PCL - OFF" },
    { type: "action", text: "FIREWALL SHUTOFF HANDLE - PULL" },
    { type: "action", text: "EXECUTE FORCED LANDING OR EJECT" }

  ]
},
{
  id: "compressor_stalls",
  title: "COMPRESSOR STALLS",
  steps: [

    { type: "action", text: "PCL - SLOWLY RETARD BELOW STALL THRESHOLD" },
    { type: "action", text: "DEFOG SWITCH - ON" },

    {
      type: "noteGroup",
      bullets: [
        [
          "Setting the DEFOG switch to ON automatically selects high bleed air inflow and will alleviate back pressure on the engine compressor"
        ]
      ]
    },

    { type: "action", text: "PCL - SLOWLY ADVANCE (AS REQUIRED)" },

    {
      type: "condition",
      text: "IF POWER IS SUFFICIENT FOR CONTINUED FLIGHT:"
    },

    { type: "action", text: "PEL - EXECUTE" },

    {
      type: "condition",
      text: "IF POWER IS INSUFFICIENT TO COMPLETE PEL:"
    },

    { type: "action", text: "PCL - OFF" },

    {
      type: "warningGroup",
      bullets: [
        [
          "When the engine is so underpowered that high rates of descent occur, any delay in shutting down the engine to feather the propeller may result in insufficient altitude to reach a suitable landing site."
        ]
      ]
    },

    { type: "action", text: "FIREWALL SHUTOFF HANDLE - PULL" },
    { type: "action", text: "EXECUTE FORCED LANDING OR EJECT" }

  ]
},
{
  id: "inadvertent_departure",
  title: "INADVERTENT DEPARTURE FROM CONTROLLED FLIGHT",
  steps: [
    { type: "action", text: "PCL - IDLE" },
    { type: "action", text: "CONTROLS - NEUTRAL" },

    {
      type: "warningGroup",
      bullets: [
        [
          "Improperly positioning the control stick/elevator aft of the neutral position may significantly delay or prevent the aircraft from recovering from an OCF/spin which could result in loss of aircraft and/or crew."
        ]
      ]
    },

    {
      type: "noteGroup",
      bullets: [
        [
          "Cycling of control positions or applying antispin controls prematurely can aggravate aircraft motion and significantly delay recovery."
        ]
      ]
    },

    { type: "action", text: "ALTITUDE - CHECK" },

    {
      type: "warningGroup",
      bullets: [
        [
          "Recommended minimum altitude for ejection is 6000 feet AGL."
        ]
      ]
    },

    { type: "action", text: "RECOVER FROM UNUSUAL ATTITUDE" },

    {
      type: "cautionGroup",
      bullets: [
        [
          "Power-on and inverted departures or spins will result in high loads on the engine and torque shaft.",
          "If an inverted or power-on departure is encountered, land as soon as conditions permit.",
          "The pilot should suspect possible engine damage and may experience unusual engine operation accompanied by low oil pressure or CHIP detector warning.",
          "In all cases of inverted or power-on departures, the engine shall be inspected by qualified maintenance personnel after flight"
        ]
      ]
    }
  ]
},
{
  id: "fire_in_flight",
  title: "FIRE IN FLIGHT",
  steps: [
    { type: "condition", text: "IF FIRE IS CONFIRMED:" },

    {
      type: "warningGroup",
      bullets: [
        [
          "Illumination of the fire warning light accompanied by one or more of the following indications is confirmation of an engine fire: smoke; flames; engine vibration; unusual sounds; high ITT; and fluctuating oil pressure, oil temperature, or hydraulic pressure."
        ]
      ]
    },

    { type: "action", text: "PCL - OFF" },
    { type: "action", text: "FIREWALL SHUTOFF HANDLE - PULL" },

    { type: "condition", text: "IF FIRE IS EXTINGUISHED:" },
    { type: "action", text: "FORCED LANDING - EXECUTE" },

    { type: "condition", text: "IF FIRE DOES NOT EXTINGUISH OR FORCED LANDING IS IMPRACTICAL:" },
    { type: "action", text: "EJECT (BOTH)" },

    { type: "condition", text: "IF FIRE IS NOT CONFIRMED:" },
    { type: "action", text: "PEL - EXECUTE" },

    {
      type: "warningGroup",
      bullets: [
        [
          "A fire warning light with no accompanying indication is not a confirmed fire. Do not shut down an engine for an unconfirmed fire."
        ],
        [
          "High engine compartment temperatures resulting from a bleed air leak may cause illumination of the fire warning light.",
          "Reducing the PCL setting towards IDLE will decrease the amount of bleed air and possibly extinguish the fire warning light; however, advancing the PCL might be required to intercept the ELP.",
          "Regardless of reducing or advancing the PCL, continue to investigate for indications confirming an engine fire."
        ],
        [
          "If the fire cannot be confirmed, the fire warning system may be at fault and should be tested as conditions permit.",
          "If only one fire loop annunciator is illuminated (top or bottom half only), a false fire indication may exist if the other loop tests good."
        ]
      ]
    }
  ]
},
{
  id: "smoke_and_fumes",
  title: "SMOKE AND FUME ELIMINATION/ELECTRICAL FIRE",
  steps: [
    {
      type: "warningGroup",
      bullets: [
        [
          "Under varying conditions of fire and/or smoke where aircraft control is jeopardized, the pilot has the option of actuating CFS or ejecting"
        ]
      ]
    },

    {
      type: "noteGroup",
      bullets: [
        [
          "If a faulty component can be identified as the source of smoke and fumes, turn defective unit off or pull respective circuit breaker. Circuit breakers for items on the hot battery bus are not accessible in flight"
        ]
      ]
    },

    { type: "action", text: "OBOGS - CHECK (BOTH)" },
    { type: "actionSub", text: "OBOGS supply lever - ON" },
    { type: "actionSub", text: "OBOGS concentration lever - MAX" },
    { type: "actionSub", text: "OBOGS pressure lever - EMERGENCY" }
  ]
},
{
  id: "chip_detector_warning",
  title: "CHIP DETECTOR WARNING",
  steps: [

    {
      type: "action",
      text: "PCL - MINIMUM NECESSARY TO INTERCEPT ELP; AVOID UNNECESSARY PCL MOVEMENTS"
    },

    {
      type: "cautionGroup",
      bullets: [
        [
          "Higher power settings may aggravate the existing condition"
        ]
      ]
    },

    { type: "action", text: "PEL - EXECUTE" }

  ]
},
{
  id: "oil_system_malfunction",
  title: "OIL SYSTEM MALFUNCTION OR LOW OIL PRESSURE",
  steps: [
    {
      type: "noteGroup",
      bullets: [
        [
          "Use this procedure for any of the following: red OIL PX annunciator illuminated, amber OIL PX annunciator illuminated, oil pressure fluctuations, oil temperature out of limits, or visibly confirmed leaking oil from the aircraft."
        ],
        [
          "If OIL PX warning illuminates and oil pressure indicates <5 psi, check OIL TRX circuit breaker on the battery bus circuit breaker panel (left front console).",
          "If the circuit breaker is open, it may be reset."
        ],
        [
          "Due to the sensitivity of the signal conditioning unit, a single, momentary illumination of the amber OIL PX caution while maneuvering is possible but may not indicate a malfunction."
        ],
        [
          "Illumination of both red and amber OIL PX message while the oil pressure gage indicates normal pressure indicates an SCU failure."
        ]
      ]
    },

    { type: "condition", text: "IF ONLY AMBER OIL PX caution ILLUMINATES:" },
    { type: "action", text: "TERMINATE MANEUVER" },
    { type: "action", text: "CHECK OIL PRESSURE; IF OIL PRESSURE IS NORMAL, CONTINUE OPERATIONS" },

    { type: "condition", text: "IF RED OIL PX WARNING ILLUMINATES AND/OR AMBER OIL PX CAUTION REMAINS ILLUMINATED FOR 5 SECONDS:" },
    { type: "action", text: "PCL - MINIMUM NECESSARY TO INTERCEPT ELP; AVOID UNNECESSARY PCL MOVEMENTS" },

    {
      type: "cautionGroup",
      bullets: [
        [
          "Higher power settings may aggravate the existing condition"
        ]
      ]
    },

    { type: "action", text: "PEL - EXECUTE" }
  ]
},
{
  id: "low_fuel_pressure",
  title: "LOW FUEL PRESSURE",
  steps: [
    { type: "action", text: "PEL - EXECUTE" },

    {
      type: "noteGroup",
      bullets: [
        [
          "If the FUEL PX warning remains illuminated, the engine-driven high pressure fuel pump is suction feeding.",
          "Engine operation with high pressure pump suction feeding is limited to 10 hours."
        ]
      ]
    },

    { type: "action", text: "BOOST PUMP SWITCH - ON" },

    {
      type: "cautionGroup",
      bullets: [
        [
          "Unless a greater emergency exists, do not reset BOOST PUMP circuit breaker (left front console) if open."
        ]
      ]
    }
  ]
},
{
  id: "high_fuel_flow",
  title: "HIGH FUEL FLOW",
  steps: [
    { type: "action", text: "PEL - EXECUTE" },

    {
      type: "warningGroup",
      bullets: [
        [
          "Higher power settings accompanied by high ITT may aggravate the existing condition. However, if ITT is within limits reducing power could result in engine flameout."
        ]
      ]
    }
  ]
},
{
  id: "obogs_failure",
  title: "OBOGS FAILURE/OVERTEMP/PHYSIOLOGICAL SYMPTOMS",
  steps: [
    {
      type: "cautionGroup",
      bullets: [
        [
          "Illumination of the OBOGS TEMP message indicates a failure of the OBOGS heat exchanger, and is considered a failure of the OBOGS system."
        ]
      ]
    },

    { type: "action", text: "GREEN RING - PULL (AS REQUIRED) (BOTH)" },

    {
      type: "warningGroup",
      bullets: [
        [
          "Emergency oxygen bottle provides approximately 10 minutes of oxygen.",
          "If aircraft pressure altitude is above 10,000 feet MSL, ensure the aircraft reaches an altitude of 10,000 feet MSL or lower prior to exhaustion of the emergency oxygen supply or the effects of hypoxia may incapacitate the crew."
        ],
        [
          "The OBOGS concentrator may malfunction resulting in zeolite dust in the breathing system without an illumination of the OBOGS FAIL light.",
          "Indications of this malfunction include respiratory irritation, coughing, or the presence of white dust in the oxygen mask.",
          "Inhalation of zeolite dust should be avoided."
        ]
      ]
    },

    {
      type: "cautionGroup",
      bullets: [
        [
          "When breathing oxygen under increased pressure, breathe at a rate and depth slightly less than normal to preclude hyperventilation."
        ]
      ]
    },

    {
      type: "noteGroup",
      bullets: [
        [
          "If physiological symptoms are recognized, immediate access to a pure and secure source of oxygen is the best course of action to expedite recovery.",
          "If the cockpit altitude is above 10,000 feet, pulling the GREEN RING is required since ambient cockpit air contains insufficient oxygen pressure to support physiological requirements.",
          "At a cockpit altitude of 10,000 feet or below, pulling the GREEN RING is optional as ambient cockpit air contains sufficient oxygen pressure to support physiological requirements."
        ],
        [
          "When the emergency oxygen system is actuated, high pressure air may make verbal communication with the other crewmember or ATC more difficult."
        ],
        [
          "Once activated, ejection seat emergency oxygen cannot be shut off and will provide oxygen flow until the cylinder is depleted (10 minutes).",
          "Since the emergency oxygen system is not regulated, it is normal for pressure to gradually decrease to the point it feels like the oxygen is depleted before reaching 10 minutes of use, however oxygen is still being supplied."
        ],
        [
          "Sharply pull the green ring up and aft to activate the emergency oxygen system.",
          "Several up and aft pull attempts may be required to fully activate oxygen flow."
        ],
        [
          "Pull force to activate the emergency oxygen system may be as high as 40 pounds."
        ]
      ]
    },

    { type: "action", text: "DESCENT BELOW 10,000 FEET MSL - INITIATE" },
    { type: "action", text: "OBOGS SUPPLY LEVER - OFF (BOTH)" }
  ]
},
{
  id: "eject",
  title: "EJECT",
  steps: [
    { type: "action", text: "EJECTION HANDLE - PULL (BOTH)" },

    {
      type: "warningGroup",
      bullets: [
        [
          "To avoid injury, grasp handle and pull sharply toward abdomen, keeping elbows against the body."
        ],
        [
          "The emergency escape system incorporates an explosive canopy fracturing system.",
          "The force of detonation blows numerous shards and small fragments outward from the canopy and into the cockpit.",
          "Some metallic fragments may be extremely hot and may cause burns upon contact with the skin.",
          "Aircrew should ensure exposed skin is covered, the oxygen mask is on, and visor is down prior to ejection or actuating the CFS system to prevent injury from shards and hot fragments."
        ],
        [
          "When ejecting over mountainous terrain exceeding 8000 feet MSL, the manual override (MOR) handle should be used to manually separate from the seat and deploy the parachute"
        ]
      ]
    },

    {
      type: "noteGroup",
      bullets: [
        [
          "If ejecting at low speed, one or both sets of risers may remain velcroed together following seat separation.",
          "This may create a slight increase in descent rate and/or an uncommanded turn.",
          "Manually separate the risers if time permits.",
          "The steering lines (toggles) are located on the backside of each of the front risers.",
          "To counter any uncommanded turns, unstow the opposite steering line or use risers for controllability."
        ]
      ]
    }
  ]
},
{
  id: "forced_landing",
  title: "FORCED LANDING",
  steps: [
    {
      type: "warningGroup",
      bullets: [
        [
          "Aircraft may float while approaching touchdown with the propeller feathered more than observed while conducting practice forced landing at 4-6% torque.",
          "Energy management is critical to achieving targeted touchdown position.",
          "Landing ground roll distance will increase with the propeller feathered."
        ],
        [
          "Landing on an unprepared surface may cause structural damage making it impossible to open the canopy or fracture it using the CFS."
        ],
        [
          "Engine failure or shutdown will completely disable the bleed air system.",
          "Depending on environmental conditions, this may cause significant canopy icing and/or fogging, and severely hamper visibility, especially from the rear cockpit."
        ]
      ]
    },

    {
      type: "cautionGroup",
      bullets: [
        [
          "Ejection is recommended if a suitable landing area is not available.",
          "If circumstances dictate an emergency landing and ejection is not possible or the ejection system malfunctions, the pilot may perform an ELP to an unprepared surface or ditch the aircraft.",
          "The aircraft structure can survive either type of forced landing; however, the risk of injury increases significantly due to crash loads and the complexity of ground or water egress.",
          "Inducing yaw (side slipping) with a known engine/oil malfunction could result in impaired windshield visibility due to oil leakage spraying onto the windshield."
        ]
      ]
    },

    { type: "action", text: "AIRSPEED - 125 KIAS PRIOR TO EXTENDING LANDING GEAR" },
    { type: "action", text: "EMER LDG GR HANDLE - PULL (AS REQUIRED)" },

    {
      type: "warningGroup",
      bullets: [
        [
          "If landing on an unprepared surface or ditching, do not extend the landing gear. Flaps will not be available without emergency gear extension."
        ]
      ]
    },

    {
      type: "noteGroup",
      bullets: [
        [
          "Normal safe indications with electrical power, when the emergency extension system has been used to lower the gear, are two green main gear lights, two red main door lights, green nose gear light, and red light in handle."
        ]
      ]
    },

    { type: "action", text: "AIRSPEED - 120 KIAS MINIMUM UNTIL INTERCEPTING FINAL; 110 KIAS MINIMUM ON FINAL" },
    { type: "action", text: "FLAPS - AS REQUIRED" },

    {
      type: "warningGroup",
      bullets: [
        [
          "Do not lower flaps LDG until landing is assured. Drag will increase dramatically once landing flaps are lowered."
        ]
      ]
    },

    {
      type: "noteGroup",
      bullets: [
        [
          "Selecting either TO or LDG flaps will extend the flaps to the commanded position if the landing gear has been extended using the emergency extension system and if battery power is available."
        ],
        [
          "Landing gear/flap retraction is not possible when the emergency extension system has been used."
        ],
        [
          "Nose wheel steering is unavailable with an inoperative engine. Maintain directional control with rudder and differential braking."
        ]
      ]
    }
  ]
},
{
  id: "precautionary_emergency_landing",
  title: "PRECAUTIONARY EMERGENCY LANDING (PEL)",
  steps: [
    {
      type: "warningGroup",
      bullets: [
        [
          "If the engine should fail while flying the PEL, refer to the Engine Failure During Flight checklist, and transition to the Forced Landing procedure."
        ],
        [
          "If rate of descent (indicated on the VSI while stabilized at 125 KIAS with gear, flaps, and speed brake retracted and 4 to 6% torque) is greater than 1500 ft/min, increase torque as necessary (up to 131%) to achieve approximately 1350 to 1500 ft/min rate of descent.",
          "If engine power is insufficient to produce a rate of descent less than 1500 ft/min, set PCL to OFF."
        ],
        [
          "Once on profile, if engine is vibrating excessively, or if indications of failure are imminent, set PCL to OFF."
        ],
        [
          "Engine failure or shutdown will completely disable the bleed air system.",
          "Depending on environmental conditions, this may cause significant canopy icing and/or fogging, severely hampering visibility, especially from the rear cockpit."
        ]
      ]
    },

    {
      type: "cautionGroup",
      bullets: [
        [
          "Inducing yaw (side slipping) with a known engine/oil malfunction could result in impaired windshield visibility due to oil leakage spraying onto the windshield."
        ],
        [
          "At higher temperature and pressure altitudes, power response will be delayed.",
          "Airspeeds below 110 KIAS on ELP final, in combination with transitioning to a high flare, may lead to a hard landing resulting in landing gear component failure."
        ]
      ]
    },

    { type: "action", text: "TURN TO NEAREST SUITABLE FIELD" },
    { type: "action", text: "CLIMB OR ACCELERATE TO INTERCEPT ELP" },
    { type: "action", text: "GEAR, FLAPS, SPEED BRAKE - UP" }
  ]
}

];
