import os
import shutil
import requests
import pandas as pd
import time
import sys
sys.stdout.reconfigure(encoding='utf-8')


selected_city = None
if len(sys.argv) > 1:
    selected_city = sys.argv[1].strip().upper()


# NOAA Global Hourly Base URL
BASE_URL = "https://www.ncei.noaa.gov/data/global-hourly/access/{year}/{usaf}{wban}.csv"

# List of years (2015 to 2025)
years = list(range(2015, 2026))

# Dictionary of cities and their NOAA USAF & WBAN Station IDs
cities_stations = { 
    "Homestead": ("722026", "12826"), 
    "Tallahassee": ("722140", "93805"), 
    "El Paso": ("722700", "23044"), 
    "Ephrata": ("727900", "24141"), 
    "Seattle": ("727930", "24233")
}

# Directory for saving data
download_dir = "NOAA_Global_Hourly_Data"
os.makedirs(download_dir, exist_ok=True)

# Function to download a file with retries
def download_file(url, save_path, retries=100, timeout=10):
    for attempt in range(retries):
        try:
            response = requests.get(url, stream=True, timeout=timeout)
            if response.status_code == 200:
                with open(save_path, "wb") as file:
                    for chunk in response.iter_content(chunk_size=1024):
                        file.write(chunk)
                print(f"✅ Downloaded: {save_path}")
                return True
            else:
                print(f"❌ Failed: {url} (Status: {response.status_code})")
        except requests.exceptions.Timeout:
            print(f"⏳ Timeout: {url} (Attempt {attempt + 1}/{retries})")
        except Exception as e:
            print(f"❌ Error downloading {url}: {e}")

        if attempt < retries - 1:
            time.sleep(5)  # Wait before retrying

    print(f"🚫 Skipped: {url} after {retries} attempts")
    return False

# Loop through each city to download data and merge into one file
for city, (usaf, wban) in cities_stations.items():
    if selected_city and city.upper() != selected_city:
        continue
    final_save_path = os.path.join(download_dir, f"{city}.csv")
    
    # ✅ Skip if final merged file already exists
    if os.path.exists(final_save_path):
        print(f"🔁 Skipping {city} - merged file already exists at {final_save_path}")
        continue

    all_data = []
    temp_files = []  # Store temporary file paths for deletion

    for year in years:
        file_url = BASE_URL.format(year=year, usaf=usaf, wban=wban)
        temp_file_path = os.path.join(download_dir, f"{city}_{usaf}_{wban}_{year}.csv")
        temp_files.append(temp_file_path)

        print(f"Downloading {city} ({usaf}-{wban}) data for {year}...")
        if download_file(file_url, temp_file_path):
            try:
                df = pd.read_csv(temp_file_path, low_memory=False)
                all_data.append(df)
            except Exception as e:
                print(f"❌ Error reading {temp_file_path}: {e}")

    # Merge all years and save as a single file
    if all_data:
        combined_df = pd.concat(all_data, ignore_index=True)
        combined_df.to_csv(final_save_path, index=False)
        print(f"✅ Merged data saved as {final_save_path}")

        # Delete individual yearly files
        for file_path in temp_files:
            if os.path.exists(file_path):
                os.remove(file_path)
                print(f"🗑️ Deleted: {file_path}")

def copy_and_rename_file(source_path, destination_folder, new_filename):
        
    # Ensure the destination folder exists
    os.makedirs(destination_folder, exist_ok=True)
    print(f"{source_path}")
    print(f"{destination_folder}")
    print(f"{new_filename}")
    
    # # Create the full destination path with the new filename
    destination_path = os.path.join(destination_folder, new_filename)
    
    # # Copy and rename the file
    shutil.copy2(source_path, destination_path)
    print(f"File copied successfully to: {destination_path}")

# Example usage
source_file = f"D:/FYPs/ffyypp/ffyypp/backend/NOAA_Global_Hourly_Data/{selected_city}.csv"  # Change this to your source file path
destination_dir = "D:/FYPs/ffyypp/ffyypp/backend/city"  # Change this to your destination folder
new_name = "Weather.csv"  # Change this to the desired new filename
copy_and_rename_file(source_file, destination_dir, new_name)

# source_file1 = f"D:/FYPs/ffyypp/ffyypp/backend/city/{selected_city}.csv"  # Change this to your source file path
# destination_dir1 = "D:/FYPs/ffyypp/ffyypp/backend/city"  # Change this to your destination folder
# new_name1 = "EL PASO.csv"  # Change this to the desired new filename

# copy_and_rename_file(source_file1, destination_dir1, new_name1)
# if selected_city !="EL PASO":
#     os.remove(source_file1)
import os

source_file = f"D:/FYPs/ffyypp/ffyypp/backend/city/{selected_city}.csv"
new_name = f"D:/FYPs/ffyypp/ffyypp/backend/city/EL PASO.csv"

os.rename(source_file, new_name)
print(f"File renamed to: {new_name}")
print("🎉 All data files downloaded, merged, and cleaned successfully!")

import pandas as pd

city_data_file = "D:/FYPs/ffyypp/ffyypp/backend/city/EL PASO.csv"
weather_data_file = "D:/FYPs/ffyypp/ffyypp/backend/city/Weather.csv"

# Load the dataset
file_path = r"EL PASO.csv"
df = pd.read_csv(city_data_file)

# List of columns to use for filling missing values in "Demand (MW)"
fill_columns = ["Demand Forecast (MW)", "Net Generation (MW)", "Demand (MW) (Adjusted)","Net Generation (MW) (Adjusted)"]  # Add more if needed

# Fill missing values one column at a time and check if further filling is needed
for col in fill_columns:
    if df['Demand (MW)'].isnull().sum() == 0:
        break  # Stop if no missing values remain
    if col in df.columns:  # Check if the column exists
        df['Demand (MW)'].fillna(df[col], inplace=True)

# Check if there are still any missing values
remaining_missing = df['Demand (MW)'].isnull().sum()
print(f"Remaining missing values in 'Demand (MW)': {remaining_missing}")

# Overwrite the original dataset with the updated data
df.to_csv(file_path, index=False)
print("Dataset updated and saved successfully.")




import pandas as pd

# Define the file path
file_path = r"EL PASO.csv"  # Using raw string (r"...") to handle backslashes

# Load the CSV file
df = pd.read_csv(city_data_file)

# List of columns to keep
columns_to_keep = ["Local Time at End of Hour", "Demand (MW)"]  # Replace with your desired columns

# Keep only the specified columns
df = df[columns_to_keep]

# Save the modified DataFrame back to CSV (optional)
df.to_csv(city_data_file, index=False)

print("Columns filtered successfully. Saved as 'EL_PASO_filtered.csv'.")

import pandas as pd

# Define the file path
file_path = r"EL PASO.csv"

# Load the CSV file
df = pd.read_csv(city_data_file)

# Specify the column to check
column_name = "Local Time at End of Hour"

# Check if the column exists
if column_name in df.columns:
    # Display data type of the column
    print(f"Data type of '{column_name}': {df[column_name].dtype}")
    
    # Show first few values
    print("\nSample values:")
    print(df[column_name].head(10))

    # Try to convert to datetime format
    df[column_name] = pd.to_datetime(df[column_name], errors="coerce")

    # Check if there are any invalid dates
    invalid_dates = df[column_name].isna().sum()
    
    if invalid_dates > 0:
        print(f"\nWarning: {invalid_dates} invalid date entries detected!")
    else:
        print("\nAll values are valid datetime format.")

    # Display the new data type after conversion
    print(f"\nUpdated data type: {df[column_name].dtype}")

else:
    print(f"Column '{column_name}' not found in the CSV file.")






import pandas as pd

# Define the file path
file_path = r"EL PASO.csv"

# Load the CSV file
df = pd.read_csv(city_data_file)

# Specify the column name
column_name = "Local Time at End of Hour"

# Check if the column exists
if column_name in df.columns:
    # Convert the column to datetime64[ns] format
    df[column_name] = pd.to_datetime(df[column_name], format="%m/%d/%Y %I:%M:%S %p", errors="coerce")

    # Check conversion results
    invalid_dates = df[column_name].isna().sum()

    if invalid_dates > 0:
        print(f"⚠️ Warning: {invalid_dates} invalid date entries after conversion!")
    else:
        print("\n✅ All values successfully converted to datetime64[ns] format!")

    # Show sample values after conversion
    print("\nSample values after conversion:")
    print(df[column_name].head(10))

    # Save the updated DataFrame back to the CSV file (overwrite with correct format)
    df.to_csv(city_data_file, index=False)
    print("\n💾 Changes saved successfully to the original file!")

else:
    print(f"Column '{column_name}' not found in the CSV file.")





import pandas as pd

# Define the file path
file_path = r"EL PASO.csv"

# Load the CSV file
df = pd.read_csv(city_data_file)

# Specify the column name
column_name = "Local Time at End of Hour"

# Ensure the column is in datetime64[ns] format
df[column_name] = pd.to_datetime(df[column_name], errors="coerce")

# Function to determine the season based on the month
def get_season(date):
    month = date.month
    if month in [12, 1, 2]:
        return "Winter"
    elif month in [3, 4, 5]:
        return "Spring"
    elif month in [6, 7, 8, 9]:
        return "Summer"
    elif month in [10, 11]:
        return "Fall"
    else:
        return "Unknown"

# Apply the function to create the "Season" column
df["Season"] = df[column_name].apply(get_season)

# Show sample values
print("\nSample data with 'Season' column:")
print(df[[column_name, "Season"]].head(20))

# Save the updated DataFrame back to the CSV file (overwrite with new column)
df.to_csv(city_data_file, index=False)
print("\n💾 Changes saved successfully to the original file with the 'Season' column!")






import pandas as pd

# Define the file path
file_path = r"Weather.csv"

# Load the CSV file
df = pd.read_csv(weather_data_file)

# Specify the column name
column_name = "DATE"

# Check if the column exists
if column_name in df.columns:
    # Display the original data type
    print(f"📌 Original Data Type of '{column_name}': {df[column_name].dtype}\n")
    
    # Check unique formats in the first few rows
    print("🔍 Sample values from the 'DATE' column:")
    print(df[column_name].head(10))

    # Count missing values
    missing_values = df[column_name].isna().sum()
    print(f"\n⚠️ Missing Values in '{column_name}': {missing_values}")

else:
    print(f"❌ Column '{column_name}' not found in the CSV file.")







import pandas as pd

# Define the file path
file_path = r"Weather.csv"

# Load the CSV file
df = pd.read_csv(weather_data_file, low_memory=False)

# Specify the column name
column_name = "DATE"

# Convert to datetime64[ns] and ensure correct format
df[column_name] = pd.to_datetime(df[column_name], errors="coerce")

# Show sample values after conversion
print("✅ Successfully converted 'DATE' to datetime64[ns] format!\n")
print(df[column_name].head(10))

# Save changes back to the original file
df.to_csv(weather_data_file, index=False)
print("\n💾 Changes saved successfully to the original file!")









import pandas as pd

# Define the file path
file_path = r"Weather.csv"

# Load the CSV file
df = pd.read_csv(weather_data_file, low_memory=False)

# List of columns to KEEP (Update this with your required columns)
columns_to_keep = ["DATE", "TMP", "DEW"]  # Modify as needed

# Keep only the specified columns
df = df[columns_to_keep]

# Show the first few rows to verify
print("✅ Kept only the required columns:\n")
print(df.head())

# Save the updated file
df.to_csv(weather_data_file, index=False)
print("\n💾 Changes saved successfully to the original file!")








import pandas as pd

# Define file path
file_path = r"Weather.csv"

# Load CSV file
df = pd.read_csv(weather_data_file, low_memory=False)

# Function to convert ISD format (divide by 10) and handle missing values
def convert_isd_value(value):
    try:
        # Replace comma with dot and remove non-numeric characters
        value = value.replace(",", ".")
        value = "".join(c for c in value if c.isdigit() or c in ['-', '.'])
        
        # Convert to float and apply scaling factor (divide by 10)
        value = float(value) / 10
        
        # Replace unrealistic values (999.9 -> NaN)
        if abs(value) >= 999:
            return None  # Mark as missing
        return value
    except:
        return None  # Handle conversion errors

# Apply conversion to TMP and DEW
df["TMP"] = df["TMP"].astype(str).apply(convert_isd_value)
df["DEW"] = df["DEW"].astype(str).apply(convert_isd_value)

# Show updated data types
print("✅ Updated Data Types:")
print(df[["TMP", "DEW"]].dtypes)

# Show sample values after conversion
print("\n🔍 Sample Values After Conversion:")
print(df.head(10))

# Save the cleaned file
df.to_csv(weather_data_file, index=False)
print("\n💾 Cleaned dataset saved as 'Weather.csv'.")








import pandas as pd

# Define file path
file_path = r"Weather.csv"  # Path to the converted dataset

# Load CSV file
df = pd.read_csv(weather_data_file, low_memory=False)

# Remove rows where TMP or DEW have missing values
df_cleaned = df.dropna(subset=["TMP", "DEW"])

# Show cleaning results
print(f"✅ Rows before cleaning: {len(df)}")
print(f"✅ Rows after removing missing values: {len(df_cleaned)}")
print(f"✅ Removed {len(df) - len(df_cleaned)} rows with missing values.")

# Save the cleaned file
df_cleaned.to_csv(weather_data_file, index=False)
print("\n💾 Cleaned dataset saved as 'Weather.csv'.")







import pandas as pd
import numpy as np

# Define file path
weather_file = r"Weather.csv"

# Load the cleaned weather dataset
df_weather = pd.read_csv(weather_data_file, low_memory=False)

# Ensure DATE is in datetime format
df_weather["DATE"] = pd.to_datetime(df_weather["DATE"], errors="coerce")

# Magnus-Tetens formula for saturation vapor pressure (hPa)
def saturation_vapor_pressure(temp):
    return 6.112 * np.exp((17.67 * temp) / (temp + 243.5))

# Calculate humidity
e_dew = saturation_vapor_pressure(df_weather["DEW"])
e_temp = saturation_vapor_pressure(df_weather["TMP"])
df_weather["HUMIDITY"] = 100 * (e_dew / e_temp)

# Ensure humidity values are within 0-100% range
df_weather["HUMIDITY"] = df_weather["HUMIDITY"].clip(0, 100)

# Show sample values
print("\n🔍 Sample Values After Humidity Calculation:")
print(df_weather[["DATE", "TMP", "DEW", "HUMIDITY"]].head(10))

# Save updated weather dataset with humidity
df_weather.to_csv(weather_data_file, index=False)
print("\n💾 Weather dataset with humidity saved as 'Weather.csv'.")










import pandas as pd

# Define file paths
el_paso_file = r"EL PASO.csv"
weather_file = r"Weather.csv"

# Load datasets
df_el_paso = pd.read_csv(city_data_file, low_memory=False)
df_weather = pd.read_csv(weather_data_file, low_memory=False)

# Convert date columns to datetime format
df_el_paso["Local Time at End of Hour"] = pd.to_datetime(df_el_paso["Local Time at End of Hour"], errors="coerce")
df_weather["DATE"] = pd.to_datetime(df_weather["DATE"], errors="coerce")

# Create an hourly timestamp column (ignoring minutes & seconds)
df_el_paso["DATE_HOUR"] = df_el_paso["Local Time at End of Hour"].dt.floor("H")
df_weather["DATE_HOUR"] = df_weather["DATE"].dt.floor("H")

# Merge datasets using a LEFT JOIN to keep only El Paso rows
df_combined = pd.merge(df_el_paso, df_weather, on="DATE_HOUR", how="left")

# Drop extra DATE column from weather data
df_combined = df_combined.drop(columns=["DATE"]).rename(columns={"Local Time at End of Hour": "DATE"})

# Show merge results
print(f"✅ Rows in El Paso data: {len(df_el_paso)}")
print(f"✅ Rows in Weather data: {len(df_weather)}")
print(f"✅ Rows after merging (same as El Paso): {len(df_combined)}")

# Save the merged dataset
df_combined.to_csv("D:/FYPs/ffyypp/ffyypp/backend/city/EL PASO_Weather.csv", index=False)
print("\n💾 Merged dataset saved as 'EL PASO.csv'.")







import pandas as pd

# Load the merged dataset
file_path = "D:/FYPs/ffyypp/ffyypp/backend/city/EL PASO_Weather.csv"
df = pd.read_csv(file_path, low_memory=False)

# Convert DATE to datetime format (to ensure proper sorting & uniqueness)
df["DATE"] = pd.to_datetime(df["DATE"], errors="coerce")

# Remove duplicate timestamps, keeping only the first occurrence
df_unique = df.drop_duplicates(subset=["DATE"], keep="first")

# Show cleaning results
print(f"✅ Rows before removing duplicates: {len(df)}")
print(f"✅ Rows after removing duplicates: {len(df_unique)}")
print(f"✅ Removed {len(df) - len(df_unique)} duplicate rows.")

# Save the cleaned dataset
df_unique.to_csv("D:/FYPs/ffyypp/ffyypp/backend/city/EL PASO_Weather.csv", index=False)
print("\n💾 Cleaned dataset saved as 'Combined_Weather_Unique.csv'.")








import pandas as pd

# Load the cleaned dataset
file_path = "D:/FYPs/ffyypp/ffyypp/backend/city/EL PASO_Weather.csv"
df = pd.read_csv(file_path, low_memory=False)

# Count missing values in each column
missing_values = df.isnull().sum()

# Display columns with missing values
print("🔍 Missing Values in Each Column:\n")
print(missing_values[missing_values > 0])

# Total missing values in the dataset
total_missing = missing_values.sum()
print(f"\n⚠️ Total Missing Values in Dataset: {total_missing}")









import pandas as pd

# Load the dataset
file_path = r"D:/FYPs/ffyypp/ffyypp/backend/city/EL PASO_Weather.csv"  # Use raw string (r"...") to avoid escape sequence issues
df = pd.read_csv(file_path, low_memory=False)

# Identify missing values before filling
missing_before = df.isnull().sum()

# Apply Forward Fill (Fill using previous row)
df.fillna(method="ffill", inplace=True)

# Identify where values were filled
filled_entries = df.isnull() & ~df.isnull()

# Print filled values
print("\n🔍 Filled Missing Values:\n")
print(df[filled_entries.any(axis=1)])

# Verify missing values are removed
print("\n✅ Missing Values After Filling:\n")
print(df.isnull().sum())

# Save the updated dataset
df.to_csv("D:/FYPs/ffyypp/ffyypp/backend/city/EL PASO_Weather.csv", index=False)
print("\n💾 Filled dataset saved as 'Combined_Weather_Filled.csv'.")







import pandas as pd

# Load the dataset
file_path = "D:/FYPs/ffyypp/ffyypp/backend/city/EL PASO_Weather.csv"  # Update with actual file path
df = pd.read_csv(file_path)

# Specify the column to delete
column_to_delete = "DATE_HOUR"  # Replace with the actual column name

# Drop the column
df.drop(columns=[column_to_delete], inplace=True)

# Save changes to the same file (overwrite)
df.to_csv(file_path, index=False)

print(f"Column '{column_to_delete}' removed. Changes saved in the same file.")









import pandas as pd

# Load the dataset
file_path = r"D:/FYPs/ffyypp/ffyypp/backend/city/EL PASO_Weather.csv"  # Use raw string (r"...") to avoid escape sequence issues
df = pd.read_csv(file_path, low_memory=False)

# Display column names and their data types
print("\n🔍 Column Names and Data Types:\n")
print(df.dtypes)

# Identify the date column
date_column = "DATE"  # Change if your date column has a different name

# Ensure it's in datetime format
df[date_column] = pd.to_datetime(df[date_column], errors="coerce")

# Print sample date values to check the format
print("\n📅 Sample Date Values & Format:\n")
print(df[date_column].head(10))











import pandas as pd

# Load the cleaned dataset
file_path = r"D:/FYPs/ffyypp/ffyypp/backend/city/EL PASO_Weather.csv"
df = pd.read_csv(file_path, low_memory=False)

# Fill missing values before conversion (if any exist)
df["TMP"].fillna(df["TMP"].mean(), inplace=True)
df["HUMIDITY"].fillna(df["HUMIDITY"].mean(), inplace=True)
df["Demand (MW)"].fillna(df["Demand (MW)"].mean(), inplace=True)

# Convert from float to int (rounding values first)
df["TMP"] = df["TMP"].round().astype(int)
df["HUMIDITY"] = df["HUMIDITY"].round().astype(int)
df["Demand (MW)"] = df["Demand (MW)"].round().astype(int)

# Display updated data types
print("\n🔍 Updated Column Names and Data Types:\n")
print(df.dtypes)

# Save the updated dataset
df.to_csv(r"D:/FYPs/ffyypp/ffyypp/backend/city/EL PASO_Weather.csv", index=False)
print("\n💾 Final dataset saved as 'Combined_Weather_Final_Int.csv'.")











import pandas as pd

# Load the dataset
file_path = r"D:/FYPs/ffyypp/ffyypp/backend/city/EL PASO_Weather.csv"
df = pd.read_csv(file_path, low_memory=False)

# Convert DATE to datetime format (if not already converted)
df["DATE"] = pd.to_datetime(df["DATE"], errors="coerce")

# Extract the hour from DATE and set it from 1 to 24
df["Hour Number"] = df["DATE"].dt.hour

# Display sample rows to verify
print("\n🔍 Sample Data After Adding 'Hour Number':\n")
print(df[["DATE", "Hour Number"]].head(10))

# Save the updated dataset
df.to_csv(file_path, index=False)

print("\n✅ 'Hour Number' column added successfully! File updated.")










import pandas as pd

# Load the updated dataset
file_path = r"D:/FYPs/ffyypp/ffyypp/backend/city/EL PASO_Weather.csv"
df = pd.read_csv(file_path, low_memory=False)

# Convert DATE to datetime format (if not already converted)
df["DATE"] = pd.to_datetime(df["DATE"], errors="coerce")

# Add 'Weekday' column (Full day name: Sunday, Monday, etc.)
df["Weekday"] = df["DATE"].dt.day_name()

# Display sample rows to verify
print("\n🔍 Sample Data After Adding 'Weekday':\n")
print(df[["DATE", "Weekday"]].head(10))

# Save the updated dataset
df.to_csv(file_path, index=False)

print("\n✅ 'Weekday' column added successfully! File updated.")











import pandas as pd

# Load the dataset
file_path = r"D:/FYPs/ffyypp/ffyypp/backend/city/EL PASO_Weather.csv"
df = pd.read_csv(file_path, low_memory=False)

# Convert DATE to datetime format (if needed)
df["DATE"] = pd.to_datetime(df["DATE"], errors="coerce")

# Mapping for Season (overwrite existing column)
season_mapping = {"Winter": 1, "Spring": 2, "Summer": 3, "Fall": 4}
df["Season"] = df["Season"].map(season_mapping)

# Ensure Weekday column exists and convert to numeric (overwrite existing column)
df["Weekday"] = df["DATE"].dt.day_name()
weekday_mapping = {"Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, 
                   "Friday": 5, "Saturday": 6, "Sunday": 7}
df["Weekday"] = df["Weekday"].map(weekday_mapping)

# Add Month column (1 = January, ..., 12 = December)
df["Month"] = df["DATE"].dt.month

# Display sample data to verify
print("\n🔍 Sample Data After Encoding:\n")
print(df[["DATE", "Season", "Weekday", "Month"]].head(10))

# Save the updated dataset
df.to_csv(file_path, index=False)

print("\n✅ 'Season' and 'Weekday' converted to numeric & 'Month' column added! File updated.")












import pandas as pd
import numpy as np
from pandas.tseries.holiday import USFederalHolidayCalendar
from datetime import datetime, timedelta

# Load dataset
file_path = r"D:/FYPs/ffyypp/ffyypp/backend/city/EL PASO_Weather.csv"
df = pd.read_csv(file_path, low_memory=False)

# Convert DATE to datetime format
df["DATE"] = pd.to_datetime(df["DATE"], errors="coerce")

# Extract the year from the dataset
years = df["DATE"].dt.year.unique()

# Function to calculate holidays that fall on specific weekdays
def get_nth_weekday(year, month, weekday, nth):
    """Returns the date of the nth weekday of a given month and year."""
    first_day = datetime(year, month, 1)
    first_weekday = first_day.weekday()  # 0 = Monday, 6 = Sunday
    days_until_weekday = (weekday - first_weekday) % 7
    return first_day + timedelta(days=days_until_weekday + (nth - 1) * 7)

# Generate dynamic holiday dates for each year in the dataset
holiday_dates = []

for year in years:
    # Federal Holidays
    holiday_dates.append(datetime(year, 1, 1))  # New Year's Day
    holiday_dates.append(get_nth_weekday(year, 1, 0, 3))  # MLK Day (3rd Monday of Jan)
    holiday_dates.append(get_nth_weekday(year, 2, 0, 3))  # Presidents' Day (3rd Monday of Feb)
    holiday_dates.append(get_nth_weekday(year, 5, 0, -1))  # Memorial Day (Last Monday of May)
    holiday_dates.append(datetime(year, 6, 19))  # Juneteenth
    holiday_dates.append(datetime(year, 7, 4))  # Independence Day
    holiday_dates.append(get_nth_weekday(year, 9, 0, 1))  # Labor Day (1st Monday of Sep)
    holiday_dates.append(datetime(year, 11, 11))  # Veterans Day
    holiday_dates.append(get_nth_weekday(year, 11, 3, 4))  # Thanksgiving (4th Thursday of Nov)
    holiday_dates.append(datetime(year, 12, 25))  # Christmas Day

    # Texas & Local Holidays in El Paso
    holiday_dates.append(datetime(year, 3, 31))  # Cesar Chavez Day (March 31)
    holiday_dates.append(get_nth_weekday(year, 11, 4, 4) + timedelta(days=1))  # Day After Thanksgiving (Friday after Thanksgiving)
    holiday_dates.append(datetime(year, 12, 24))  # Christmas Eve
    
    # Good Friday (Friday before Easter Sunday)
    # Easter calculation using Gauss algorithm (for Western Christian Easter)
    a = year % 19
    b = year // 100
    c = year % 100
    d = b // 4
    e = b % 4
    f = (b + 8) // 25
    g = (b - f + 1) // 3
    h = (19 * a + b - d - g + 15) % 30
    i = c // 4
    k = c % 4
    l = (32 + 2 * e + 2 * i - h - k) % 7
    m = (a + 11 * h + 22 * l) // 451
    easter_month = (h + l - 7 * m + 114) // 31
    easter_day = ((h + l - 7 * m + 114) % 31) + 1
    good_friday = datetime(year, easter_month, easter_day) - timedelta(days=2)
    holiday_dates.append(good_friday)  # Good Friday

# Convert holiday list to datetime for comparison
holiday_dates = pd.to_datetime(holiday_dates)

# Add 'Public Holiday' column (1 if holiday, 0 otherwise)
df["Public Holiday"] = df["DATE"].dt.date.isin(holiday_dates.date).astype(int)

# Display sample data
print("\n🔍 Sample Data After Adding 'Public Holiday':\n")
print(df[["DATE", "Public Holiday"]].head(10))

# Save the updated dataset
df.to_csv(file_path, index=False)

print("\n✅ Public holidays added successfully! File updated.")









import pandas as pd

# File path for weather dataset
weather_file = f"D:/FYPs/ffyypp/ffyypp/backend/NOAA_Global_Hourly_Data/{selected_city}.csv"

# Load dataset
df_weather = pd.read_csv(weather_file, low_memory=False)

# Convert DATE column to datetime format
df_weather["DATE"] = pd.to_datetime(df_weather["DATE"], errors="coerce")

### 🔹 Extracting Wind Speed (from 'WND' column)
# WND format: "dddff,1,N,ffff,1" → Wind Speed is 4th value (ffff)
df_weather["Wind Speed"] = (
    df_weather["WND"]
    .astype(str)
    .str.split(",", expand=True)[3]  # Extract 4th value
    .str.lstrip("0")  # Remove leading zeros
    .replace("", "0")  # Replace empty values with "0"
    .astype(float) / 10  # Convert to m/s
)

# Replace missing Wind Speed values (999.9) with NaN
df_weather["Wind Speed"] = df_weather["Wind Speed"].replace(999.9, None)

### 🔹 Extracting Rainfall/Snowfall (from 'AA1' column)
# AA1 format: "01,0000,9,5" → Precipitation is 2nd value (0000)
df_weather["Rainfall/Snowfall"] = (
    df_weather["AA1"]
    .astype(str)
    .str.split(",", expand=True)[1]  # Extract 2nd value
    .str.lstrip("0")  # Remove leading zeros
    .replace("", "0")  # Replace empty values with "0"
    .astype(float) / 10  # Convert to mm
)

# Replace missing Rainfall/Snowfall values (999.9) with NaN
df_weather["Rainfall/Snowfall"] = df_weather["Rainfall/Snowfall"].replace(999.9, None)

# Save extracted data separately before merging
output_file = r"D:/FYPs/ffyypp/ffyypp/backend/city/ELPASO_Weather_Processed.csv"
df_weather[["DATE", "Wind Speed", "Rainfall/Snowfall"]].to_csv(output_file, index=False)

# Print sample extracted data
print("\n🔍 Sample Extracted Data:\n")
print(df_weather[["DATE", "Wind Speed", "Rainfall/Snowfall"]].head(10))

print(f"\n✅ Wind Speed & Rainfall/Snowfall extracted successfully! File saved as '{output_file}'.")







import pandas as pd

# File paths
el_paso_file = r"D:/FYPs/ffyypp/ffyypp/backend/city/EL PASO_Weather.csv"
weather_file = r"D:/FYPs/ffyypp/ffyypp/backend/city/ELPASO_Weather_Processed.csv"

# Load datasets
df_el_paso = pd.read_csv(el_paso_file, low_memory=False)
df_weather = pd.read_csv(weather_file, low_memory=False)

# Convert DATE columns to datetime format
df_el_paso["DATE"] = pd.to_datetime(df_el_paso["DATE"], errors="coerce")
df_weather["DATE"] = pd.to_datetime(df_weather["DATE"], errors="coerce")

# Round both datasets to the nearest hour (for correct matching)
df_el_paso["DATE"] = df_el_paso["DATE"].dt.floor("H")
df_weather["DATE"] = df_weather["DATE"].dt.floor("H")

# Merge datasets based on DATE (Left Join to keep all EL PASO data)
df_merged = df_el_paso.merge(df_weather, on="DATE", how="left")

# Save the updated dataset back to EL PASO.csv
df_merged.to_csv(el_paso_file, index=False)

# Display sample rows to verify
print("\n🔍 Sample Data After Merging Wind Speed & Rainfall/Snowfall:\n")
print(df_merged.head(10))

print("\n✅ Wind Speed & Rainfall/Snowfall added successfully! File updated: 'EL PASO.csv'.")








import pandas as pd

# File paths
input_file = r"D:/FYPs/ffyypp/ffyypp/backend/city/EL PASO_Weather.csv"
output_file = r"D:/FYPs/ffyypp/ffyypp/backend/city/EL PASO_Weather.csv"

# Load dataset
df = pd.read_csv(input_file, low_memory=False)

# Convert DATE column to datetime format
df["DATE"] = pd.to_datetime(df["DATE"], errors="coerce")

# Sort data to prioritize rows with Wind Speed or Rainfall/Snowfall values
df.sort_values(by=["DATE", "Wind Speed", "Rainfall/Snowfall"], ascending=[True, False, False], inplace=True)

# Drop all duplicate timestamps, keeping the first occurrence (which has data prioritized)
df_cleaned = df.drop_duplicates(subset=["DATE"], keep="first")

# Save the fully cleaned dataset
df_cleaned.to_csv(output_file, index=False)

# Print results
print(f"\n✅ All duplicate timestamps removed! Prioritized rows with weather data.")
print(f"📁 Cleaned file saved as: {output_file}")
print(f"🗑️ Total duplicates removed: {len(df) - len(df_cleaned)}")








import pandas as pd

# File paths
input_file = r"D:/FYPs/ffyypp/ffyypp/backend/city/EL PASO_Weather.csv"
output_file = r"D:/FYPs/ffyypp/ffyypp/backend/city/EL PASO_Weather.csv"

# Load dataset
df = pd.read_csv(input_file, low_memory=False)

# Convert DATE column to datetime format
df["DATE"] = pd.to_datetime(df["DATE"], errors="coerce")

# Fill missing values using forward fill, then backward fill
df["Wind Speed"] = df["Wind Speed"].fillna(method="ffill").fillna(method="bfill")
df["Rainfall/Snowfall"] = df["Rainfall/Snowfall"].fillna(method="ffill").fillna(method="bfill")

# If there are still missing values, fill with the mean
df["Wind Speed"].fillna(df["Wind Speed"].mean(), inplace=True)
df["Rainfall/Snowfall"].fillna(df["Rainfall/Snowfall"].mean(), inplace=True)

# Save the cleaned dataset
df.to_csv(output_file, index=False)

# Print results
print(f"\n✅ Missing values filled successfully!")
print(f"📁 Cleaned file saved as: {output_file}")
print(f"🔍 Remaining missing values:\n{df.isnull().sum()}")








import pandas as pd

# Load the updated dataset
file_path = r"D:/FYPs/ffyypp/ffyypp/backend/city/EL PASO_Weather.csv"
df = pd.read_csv(file_path, low_memory=False)

# Display column names and their data types
print("\n🔍 Column Names and Data Types:\n")
print(df.dtypes)

# Count missing values in each column
missing_values = df.isnull().sum()

# Display columns with missing values
print("\n⚠️ Missing Values in Each Column:\n")
print(missing_values[missing_values > 0])

# Total missing values in the dataset
total_missing = missing_values.sum()
print(f"\n⚠️ Total Missing Values in Dataset: {total_missing}")

# If no missing values are found
if total_missing == 0:
    print("\n✅ No missing values found in the dataset!")

# Print sample rows to check data
print("\n📌 Sample Data (First 10 Rows):\n")
print(df.head(10))

print("\n📌 Sample Data (Last 10 Rows):\n")
print(df.tail(10))








import os

# Specify the folder containing the CSV files
folder_path = r"D:/FYPs/ffyypp/ffyypp/backend/city"  # Change this to your folder path

# Name of the CSV file to keep
file_to_keep = "EL PASO_Weather.csv"  # Change this to the file you want to keep

# New name for the kept file
new_file_name = f"{selected_city}.csv"  # Change this to your desired new name

# List all files in the folder
for file in os.listdir(folder_path):
    file_path = os.path.join(folder_path, file)
    
    # Check if it's a CSV file and not the one to keep
    if file.endswith(".csv"):
        if file == file_to_keep:
            # Rename the file
            new_file_path = os.path.join(folder_path, new_file_name)
            os.rename(file_path, new_file_path)
            print(f"Renamed: {file} → {new_file_name}")
        else:
            os.remove(file_path)  # Delete the file
            print(f"Deleted: {file}")

print("Cleanup and renaming complete.")







import pandas as pd

# File paths
input_file = f"D:/FYPs/ffyypp/ffyypp/backend/city/{selected_city}.csv"
output_file_2023 = f"D:/FYPs/ffyypp/ffyypp/backend/city/{selected_city}_TrainingData.csv"
output_file_2024 = f"D:/FYPs/ffyypp/ffyypp/backend/city/{selected_city}_ValidationData.csv"

# Load dataset
df = pd.read_csv(input_file, low_memory=False)

# Convert DATE column to datetime format
df["DATE"] = pd.to_datetime(df["DATE"], errors="coerce")

# Split data into two parts
df_until_2023 = df[df["DATE"] < "2024-01-01"]  # Data till end of 2023
df_from_2024 = df[df["DATE"] >= "2024-01-01"]  # Data from 2024 onwards

# Save the split datasets
df_until_2023.to_csv(output_file_2023, index=False)
df_from_2024.to_csv(output_file_2024, index=False)

# Print confirmation
print("\n✅ CSV Successfully Split!")
print(f"📁 Data until 2023 saved as: {output_file_2023}")
print(f"📁 Data from 2024 onwards saved as: {output_file_2024}")







import pandas as pd

# Load the CSV file
file_path = f"D:/FYPs/ffyypp/ffyypp/backend/city/{selected_city}_ValidationData.csv"
df = pd.read_csv(file_path)

# Remove the column (e.g., 'column_name')
df = df.drop(columns=['Demand (MW)'])

# Save the updated dataframe back to a CSV file
df.to_csv(f"D:/FYPs/ffyypp/ffyypp/backend/city/{selected_city}_TestData.csv", index=False)

print("Column removed and updated file saved.")