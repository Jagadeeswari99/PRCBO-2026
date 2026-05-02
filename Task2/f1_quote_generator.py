import random

quotes = [
    {
        "quote": "To finish first, first you have to finish.",
        "driver": "Niki Lauda",
        "team": "Ferrari"
    },
    {
        "quote": "I am not designed to finish second or third. I am designed to win.",
        "driver": "Ayrton Senna",
        "team": "McLaren"
    },
    {
        "quote": "You cannot overtake 15 cars in sunny weather, but you can when it's raining.",
        "driver": "Ayrton Senna",
        "team": "McLaren"
    },
    {
        "quote": "If you no longer go for a gap that exists, you are no longer a racing driver.",
        "driver": "Ayrton Senna",
        "team": "McLaren"
    },
    {
        "quote": "I don't know driving in another way which isn't risky.",
        "driver": "Michael Schumacher",
        "team": "Ferrari"
    },
    {
        "quote": "Once you have tasted Formula One, you will never want to leave.",
        "driver": "Michael Schumacher",
        "team": "Ferrari"
    },
    {
        "quote": "Still I rise.",
        "driver": "Lewis Hamilton",
        "team": "Mercedes"
    },
    {
        "quote": "My hunger for victory is stronger than any setback.",
        "driver": "Lewis Hamilton",
        "team": "Mercedes"
    },
    {
        "quote": "I always try to drive at the maximum — that is just how I am.",
        "driver": "Max Verstappen",
        "team": "Red Bull Racing"
    },
    {
        "quote": "The car is the star, but the driver makes the difference.",
        "driver": "Charles Leclerc",
        "team": "Ferrari"
    },
]

def get_random_quote():
    data = random.choice(quotes)
    print("\n" + "=" * 55)
    print(f"  🏎️  F1 QUOTE OF THE MOMENT")
    print("=" * 55)
    print(f"\n  \"{data['quote']}\"")
    print(f"\n  — {data['driver']}  |  {data['team']}")
    print("\n" + "=" * 55)
    return data

def get_quote_by_driver(driver_name):
    matches = [q for q in quotes if driver_name.lower() in q["driver"].lower()]
    if not matches:
        print(f"\n  ❌ No quotes found for '{driver_name}'")
        return None
    data = random.choice(matches)
    print("\n" + "=" * 55)
    print(f"  🏁  QUOTE BY {data['driver'].upper()}")
    print("=" * 55)
    print(f"\n  \"{data['quote']}\"")
    print(f"\n  — {data['driver']}  |  {data['team']}")
    print("\n" + "=" * 55)
    return data

def run():
    print("\n  🏆 Welcome to the F1 Quote Generator!")
    print("  ──────────────────────────────────────")
    print("  1. Random Quote")
    print("  2. Quote by Driver")
    print("  3. Exit")

    while True:
        choice = input("\n  Choose (1/2/3): ").strip()

        if choice == "1":
            get_random_quote()

        elif choice == "2":
            name = input("  Enter driver name: ").strip()
            get_quote_by_driver(name)

        elif choice == "3":
            print("\n  🏁 Goodbye! Keep racing! 🏎️\n")
            break

        else:
            print("  ⚠️  Invalid choice. Try again.")

run()