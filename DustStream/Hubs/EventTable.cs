using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DustStream.Hubs
{
    public static class EventTable
    {
        public enum EventID
        {
            EventProcedureExecutionStatusChanged = 0,
            EventReleaseStatusChanged
        }

        private static readonly Dictionary<EventID, string> BroadcastEventTable = new Dictionary<EventID, string>()
        {
            { EventID.EventProcedureExecutionStatusChanged, "EventProcedureExecutionStatusChanged" },
            { EventID.EventReleaseStatusChanged, "EventReleaseStatusChanged" }
        };

        public static string GetEventMessage(EventID eventId)
        {
            return BroadcastEventTable[eventId];
        }
    }
}