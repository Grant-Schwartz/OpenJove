/*

	SPD2FITS is a tool to convert SPD data files produced by SkyPipe (radiosky.com)
	into FITS binary tables.

	SPD2FITS V0.2 06-APR-2005
	(C) 2004-5 by jupiterradio.com
	http://www.jupiterradio.com
	
	SPD file format (C) by radiosky.com
	http://www.radiosky.com
	
	JavaFits (C) by NASA
	http://heasarc.gsfc.nasa.gov/docs/heasarc/fits/java/v0.9/
	
	For updates of SPD2FITS, check: http://www.jupiterradio.com

	Copying, distribution, altering of the SPD2FITS-source:
	Free, as long as this notice remains unchanged!

	Disclaimer: jupiterradio.com cannot be held liable for anything
	
	Supports the following data formats for now:
	[Date] (8 bytes)
	[Channel 1 Data] (8 bytes)
	( [Channel 2 Data] (8 bytes) )
	( [Channel 3 Data] (8 bytes) )

	Integer Save format:
	[Date] (8 bytes)
	[Channel 1 Data] (8 bytes)
	( [Channel 2 Data] (2 bytes) )
	( [Channel 3 Data] (2 bytes) )
	
	Compile with:
	Run with:
	
*/

import java.io.*;
import java.util.Arrays;
import org.json.simple.JSONObject;
import org.json.simple.JSONArray;


public class SPD2JSON {
	public static void main(String[] args) throws Exception {
		String version = "0.1";
		int timebytes = 8;
		int databytes = 8;
		boolean isintsaveformat = false;
		try {
			File file = new File(args[0]);
			InputStream is = new FileInputStream(file);
			DataInputStream dis = new DataInputStream( is );
			long length = file.length();
			if (length > Integer.MAX_VALUE) {
				throw new IOException("File is too large");
			} else {
				byte[] bytes = new byte[(int)length];
				int offset = 0;
				int numRead = 0;
				while (offset < bytes.length && (numRead = is.read(bytes, offset, bytes.length-offset) ) >= 0) {
					offset += numRead;
				}
				if (offset < bytes.length) {
					throw new IOException("Could not completely read file "+file.getName());
				}
				dis.close();
				is.close();
				double start = arr2double(bytes, 10);
				double finish = arr2double(bytes, 18);			
				double lat = arr2double(bytes, 26);			
				double lng = arr2double(bytes, 34);			
				double maxy = arr2double(bytes, 42);			
				double miny = arr2double(bytes, 50);			
				double timezone = arr2int(bytes, 58);			
				String source = arr2str(bytes, 60, 10);
				String author = arr2str(bytes, 70, 20);
				String localname = arr2str(bytes, 90, 20);
				String location = arr2str(bytes, 110, 40);
				int channels = arr2int(bytes, 150);			
				long notelength = arr2int(bytes, 152);			
				String note = arr2str(bytes, 156, (int)notelength);
				int begindata = 156 + (int)notelength;
				int datalen = 0;
				if (note.indexOf("Integer Save") > 0) {
					databytes = 2;
					isintsaveformat = true;
				}
				if (channels == 1) {
					datalen = (int) ( ( length - (156 + notelength) ) / (timebytes + databytes) );
				} else if (channels == 2) {
					datalen = (int) ( ( length - (156 + notelength) ) / (timebytes + databytes * 2) );
				} else { // 3 channels
					datalen = (int) ( ( length - (156 + notelength) ) / (timebytes + databytes * 3) );
				}
				double[] time  = new double[datalen];
				double[] ch1  = new double[datalen];
				double[] ch2  = new double[datalen];
				double[] ch3  = new double[datalen];
				int cnt = 0;
				for (int i = 0; i < datalen; i++) {
					time[i] = arr2double(bytes, begindata + cnt);
					if (isintsaveformat) {
						ch1[i] = (double)arr2int(bytes, begindata + (cnt + timebytes) );
					} else {
						ch1[i] = arr2double(bytes, begindata + (cnt + timebytes) );
					}
					if (channels == 3) {
						if (isintsaveformat) {
							ch2[i] = (double)arr2int(bytes, begindata + (cnt + timebytes + databytes) );
							ch3[i] = (double)arr2int(bytes, begindata + (cnt + timebytes + databytes*2) );
						} else {
							ch2[i] = arr2double(bytes, begindata + (cnt + timebytes + databytes) );
							ch3[i] = arr2double(bytes, begindata + (cnt + timebytes + databytes*2) );
						}
						cnt = cnt + timebytes + databytes * 3;
					} else if (channels == 2) {
						if (isintsaveformat) {
							ch2[i] = (double)arr2int(bytes, begindata + (cnt + timebytes + databytes) );
						} else {
							ch2[i] = arr2double(bytes, begindata + (cnt + timebytes + databytes) );
						}
						cnt = cnt + timebytes + databytes * 2;
					} else {
						cnt = cnt + timebytes + databytes;
					}
				}
				JSONObject obj = new JSONObject();
				JSONObject header = new JSONObject();
				header.put("start",start);
				header.put("finish",finish);
				header.put("lat",lat);
				header.put("lat",lat);
				header.put("maxy",maxy);
				header.put("miny",miny);
				header.put("timezone",timezone);
				header.put("source",source);
				header.put("author",author);
				header.put("localname",localname);
				header.put("location",location);
				header.put("channels",channels);
				obj.put("header",header);
				obj.put("note",note);
				JSONArray timestamps = new JSONArray();
				JSONArray ch1arr = new JSONArray();
				JSONArray ch2arr = new JSONArray();
				JSONArray ch3arr = new JSONArray();
				int i;
				for (i = 0; i < time.length; i++) {
					timestamps.add(time[i]);
					ch1arr.add(ch1[i]);
					ch2arr.add(ch2[i]);
					ch3arr.add(ch3[i]);
				}
				obj.put("timestamps",timestamps);
				obj.put("ch1",ch1arr);
				obj.put("ch2",ch2arr);
				obj.put("ch3",ch3arr);
				try (FileWriter jsonFile = new FileWriter("data.json")) {
					 
					jsonFile.write(obj.toJSONString());
					jsonFile.flush();
		 
		        } catch (IOException e) {
		            e.printStackTrace();
		        }
				}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public static String arr2str(byte[] arr, int start, int len) {
		int i = 0;
		int cnt = 0;
		byte[] tmp = new byte[len];
		for (i = start; i < (start + len); i++) {
			if ( arr[i] <= 0 ){
				tmp[cnt] = 32;  // temporary hack for values < 0 ; otherwise the FITS table is unreadable
			} else {
				tmp[cnt] = arr[i];
			}
			cnt++;
		}
		String ret = new String(tmp);
		return ret;
	}
	
	public static double arr2double (byte[] arr, int start) {
		int i = 0;
		int len = 8;
		int cnt = 0;
		byte[] tmp = new byte[len];
		for (i = start; i < (start + len); i++) {
			tmp[cnt] = arr[i];
			cnt++;
		}
		long accum = 0;
		i = 0;
		for ( int shiftBy = 0; shiftBy < 64; shiftBy += 8 ) {
			accum |= ( (long)( tmp[i] & 0xff ) ) << shiftBy;
			i++;
		}
		return Double.longBitsToDouble(accum);
	}
	
	public static long arr2long (byte[] arr, int start) {
		int i = 0;
		int len = 4;
		int cnt = 0;
		byte[] tmp = new byte[len];
		for (i = start; i < (start + len); i++) {
			tmp[cnt] = arr[i];
			cnt++;
		}
		long accum = 0;
		i = 0;
		for ( int shiftBy = 0; shiftBy < 32; shiftBy += 8 ) {
			accum |= ( (long)( tmp[i] & 0xff ) ) << shiftBy;
			i++;
		}
		return accum;
	}

	public static int arr2int (byte[] arr, int start) {
		int low = arr[start] & 0xff;
		int high = arr[start+1] & 0xff;
		return (int)( high << 8 | low );
	}

}


